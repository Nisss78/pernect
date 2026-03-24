FROM python:3.12-slim

WORKDIR /app

# 依存インストールを先にキャッシュ（コード変更時の再ビルド高速化）
COPY pyproject.toml .
RUN pip install --no-cache-dir . && rm -rf /root/.cache

# アプリコードをコピー
COPY app/ app/

ENV PORT=8080
EXPOSE 8080

CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT
