# ==========================================================
#  pix_fraud_inference_v10.py
#  Versão completa — inclui probabilidades por tipo de fraude
# ==========================================================

import os
import json
import numpy as np
import pandas as pd
import mlflow
from pathlib import Path
from datetime import datetime
from application.models.transacao import Transacao

# ==========================================================
# 1. Configurações de caminhos e artefatos
# ==========================================================
BASE_DIR = Path(__file__).resolve().parents[1]
ARTIFACT_DIR = BASE_DIR / "model_artifacts"
# Compatibilidade com código que espera string para ARTIFACT_DIR
ARTIFACT_DIR = str(ARTIFACT_DIR)
# Garante que o diretório exista em tempo de execução
os.makedirs(ARTIFACT_DIR, exist_ok=True)

BINARY_MODEL_PATH = os.path.join(ARTIFACT_DIR, "fraud_binary_pipeline")
MULTICLASS_MODEL_PATH = os.path.join(ARTIFACT_DIR, "fraud_type_pipeline")
LABEL_MAP_PATH = os.path.join(ARTIFACT_DIR, "fraud_type_label_map.json")

# ==========================================================
# 2. Carregamento dos modelos e metadados
# ==========================================================
print(f"Carregando modelo binário de: {BINARY_MODEL_PATH}...")
model_binary = mlflow.sklearn.load_model(BINARY_MODEL_PATH)
print("Modelo binário carregado com sucesso.")

print(f"Carregando modelo multiclasse de: {MULTICLASS_MODEL_PATH}...")
model_multiclass = mlflow.sklearn.load_model(MULTICLASS_MODEL_PATH)
print("Modelo multiclasse carregado com sucesso.")

print(f"Carregando mapa de labels de: {LABEL_MAP_PATH}...")
with open(LABEL_MAP_PATH, "r") as f:
    label_map_raw = json.load(f)

# Normalizar o mapa de labels para int -> nome e criar lista ordenada de classes
label_map_int = {int(k): v for k, v in label_map_raw.items()}
multiclass_class_names = [label_map_int[k] for k in sorted(label_map_int.keys())]
print(f"Mapa de labels carregado. Classes ordenadas: {multiclass_class_names}")

# ==========================================================
# 3. Função de inferência
# ==========================================================
def run_inference(input_df: pd.DataFrame, fraud_threshold: float = 0.5):
    """
    Executa a inferência completa:
    1. Modelo binário → fraude ou legítima
    2. Modelo multiclasse → tipo de fraude (se aplicável)
    Retorna dict com probabilidades e mapeamentos por tipo.
    """
    print(f"\n--- Recebida {len(input_df)} transação(s) para análise. ---")
    print("DEBUG - input_df.dtypes:")
    print(input_df.dtypes)
    print("DEBUG - input_df.head():")
    print(input_df.head().to_string())

    # ======================================================
    # Etapa 1: Modelo Binário (Detecção de Fraude)
    # ======================================================
    print("\nExecutando modelo binário...")
    pred_binary_proba_array = model_binary.predict_proba(input_df)
    print(f"DEBUG - Probabilidades retornadas pelo modelo binário: {pred_binary_proba_array}")

    # --- CORREÇÃO ROBUSTA PARA VÁRIOS FORMATOS DE SAÍDA ---
    proba = pred_binary_proba_array

    if isinstance(proba, np.ndarray) and proba.ndim == 2:
        # formato esperado: [[p0, p1]]
        pred_binary_proba_float = float(round(proba[0][1], 4))
    elif isinstance(proba, np.ndarray) and proba.ndim == 1 and len(proba) == 2:
        # formato: [p0, p1]
        pred_binary_proba_float = float(round(proba[1], 4))
    elif isinstance(proba, np.ndarray) and proba.ndim == 1 and len(proba) == 1:
        # formato: [p1] - probabilidade direta
        pred_binary_proba_float = float(round(proba[0], 4))
    else:
        # Pode ser float ou outro tipo; forçar float
        pred_binary_proba_float = float(round(float(proba), 4))

    print(f"DEBUG - Probabilidade normalizada (fraude=1): {pred_binary_proba_float}")

    pred_binary_label = int(pred_binary_proba_float >= fraud_threshold)
    print(f"Probabilidade de fraude (classe=1): {pred_binary_proba_float}")
    print(f"Predição binária final: {'FRAUDE' if pred_binary_label == 1 else 'LEGÍTIMA'}")

    # ======================================================
    # Etapa 2: Modelo Multiclasse (Classificação do Tipo de Fraude)
    # ======================================================
    pred_multi_label = None
    pred_multi_proba = None
    pred_multi_proba_dict = None

    if pred_binary_label == 1:
        print("\nExecutando modelo multiclasse (tipo de fraude)...")
        pred_multi_proba_array = model_multiclass.predict_proba(input_df)
        print(f"DEBUG - Probabilidades retornadas pelo modelo multiclasse: {pred_multi_proba_array}")

        # Normalizar para vetor de probabilidades por classes
        if isinstance(pred_multi_proba_array, np.ndarray) and pred_multi_proba_array.ndim == 2:
            prob_array = pred_multi_proba_array[0]
        elif isinstance(pred_multi_proba_array, np.ndarray) and pred_multi_proba_array.ndim == 1:
            prob_array = pred_multi_proba_array
        else:
            prob_array = np.array(pred_multi_proba_array).ravel()

        # Caso o número de probabilidades não bata com o número de classes,
        # cortamos/expandimos com zeros (defensivo).
        n_classes = len(multiclass_class_names)
        if prob_array.size != n_classes:
            print(f"Aviso: número de probabilidades ({prob_array.size}) != número de classes ({n_classes}). Ajustando de forma defensiva.")
            # Ajustar: se houver mais probs, truncar; se houver menos, preencher com zeros
            if prob_array.size > n_classes:
                prob_array = prob_array[:n_classes]
            else:
                prob_array = np.concatenate([prob_array, np.zeros(n_classes - prob_array.size)])

        # Mapear nome_da_classe -> probabilidade
        pred_multi_proba_dict = {
            multiclass_class_names[i]: float(round(float(prob_array[i]), 4))
            for i in range(len(multiclass_class_names))
        }

        # Escolher label e confiança
        argmax_idx = int(np.argmax(prob_array))
        pred_multi_label = multiclass_class_names[argmax_idx]
        pred_multi_proba = float(round(float(prob_array[argmax_idx]), 4))

        print(f"Tipo de fraude previsto: {pred_multi_label} (confiança={pred_multi_proba})")
        print(f"Probabilidades por tipo: {pred_multi_proba_dict}")
    else:
        print("Transação legítima — modelo multiclasse não executado.")

    # ======================================================
    # Retornar resultado consolidado
    # ======================================================
    result = {
        "isFraud": bool(pred_binary_label),
        "fraudProbability": pred_binary_proba_float,
        "fraudType": pred_multi_label,
        "fraudTypeConfidence": pred_multi_proba,
        "fraudTypeProbabilities": pred_multi_proba_dict,
        "timestampInferencia": datetime.now().isoformat()
    }

    return result

# ==========================================================
# 4. Exemplo de teste
# ==========================================================
def rodar(transacao: Transacao) -> dict[str, any]:
    # construir "data" a partir do objeto `transacao`, preservando o formato de listas e isoformat para datetimes
    def _val(attr, default):
        v = getattr(transacao, attr, default)
        if isinstance(v, datetime):
            return v.isoformat()
        return v

    data = {
        "id_transacao": [_val("idTransacao", "t2-teste-real-fraude")],
        "pagador_conta_aberta_em": [_val("pagadorContaAbertaEm", "2023-05-10T10:00:00")],
        "pagador_segundos_desde_ultima_tx": [_val("pagadorSegundosDesdeUltimaTx", 300)],
        "pagador_data_nascimento": [_val("pagadorDataNascimento", "1999-07-15T00:00:00")],
        "valor_transacao": [_val("valorTransacao", 1200000.0)],
        "tipo_iniciacao_pix_id": [_val("tipoIniciacaoPixId", 2)],
        "recebedor_txs_ultima_1h": [_val("recebedorTxsUltima1h", 5)],
        "recebedor_idade_conta_dias": [_val("recebedorIdadeContaDias", 10)],
        "pagador_tipo_conta_id": [_val("pagadorTipoContaId", 2)],
        "pagador_valor_ultimas_24h": [_val("pagadorValorUltimas24h", 19500.0)],
        "pagador_interacoes_com_recebedor": [_val("pagadorInteracoesComRecebedor", 1)],
        "finalidade_pix_id": [_val("finalidadePixId", 3)],
        "recebedor_natureza_id": [_val("recebedorNaturezaId", 1)],
        "recebedor_valor_ultima_1h": [_val("recebedorValorUltima1h", 19500.0)],
        "recebedor_saldo": [_val("recebedorSaldo", 19500.0)],
        "recebedor_tipo_conta_id": [_val("recebedorTipoContaId", 2)],
        "pagador_idade_conta_dias": [_val("pagadorIdadeContaDias", 90)],
        "primeira_interacao": [_val("primeiraInteracao", 1)],
        "valor_vs_saldo_pagador": [_val("valorVsSaldoPagador", 0.9)],
        "recebedor_data_nascimento": [_val("recebedorDataNascimento", "2001-01-01T00:00:00")],
        "pagador_saldo": [_val("pagadorSaldo", 20000.0)],
        "pagador_txs_ultimas_24h": [_val("pagadorTxsUltimas24h", 1)],
        "recebedor_num_pagadores_unicos_24h": [_val("recebedorNumPagadoresUnicos24h", 1)],
        "recebedor_conta_aberta_em": [_val("recebedorContaAbertaEm", "2025-11-01T00:00:00")],
        "pagador_natureza_id": [_val("pagadorNaturezaId", 1)],
        "data_transacao": [_val("dataTransacao", "2025-11-08T23:30:00")],
        "valor_vs_media_pagador_30d": [_val("valorVsMediaPagador30d", 25.8)],
    }
    df_input = pd.DataFrame(data)
    resultado = run_inference(df_input)

    print("\n--- Resultado Final ---")
    print(json.dumps(resultado, indent=4, ensure_ascii=False))
    return resultado