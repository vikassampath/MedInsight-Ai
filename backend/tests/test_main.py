from datetime import datetime

from fastapi.testclient import TestClient

from backend.app.main import app


client = TestClient(app)


def test_health_returns_service_status_and_timestamp() -> None:
    response = client.get("/api/health")

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ok"
    assert payload["service"] == "medinsight-api"
    datetime.fromisoformat(payload["timestamp"].replace("Z", "+00:00"))
    assert "not a diagnosis" in payload["safety_notice"].lower()