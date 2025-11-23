import azure.functions as func
import logging
import json
from pydantic import ValidationError
from application.services import analise_service
from application.models.transacao import Transacao

app = func.FunctionApp()

@app.route(route="analisar", methods=["POST"])
def analisar(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    try:
        req_body = req.get_json()
    except ValueError:
        return func.HttpResponse(
            json.dumps({
                "success": False,
                "message": "Invalid JSON payload. Request body must be a valid JSON object.",
                "details": None
            }),
            status_code=400,
            mimetype="application/json"
        )

    try:
        data = Transacao(**req_body)
    except ValidationError as e:
        return func.HttpResponse(
            json.dumps({
                "success": False,
                "message": "Invalid input.",
                "details": e.errors()
            }),
            status_code=400,
            mimetype="application/json"
        )

    resultado = analise_service.rodar(data)

    return func.HttpResponse(
        json.dumps({
            "success": True,
            "message": "Analysis completed.",
            "details": resultado
        }),
        status_code=200,
        mimetype="application/json"
    )
