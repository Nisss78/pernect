"""
GCP Budget Alert → Billing Auto-Disable Cloud Function

予算超過時にプロジェクトの課金を自動停止する Cloud Function。

セットアップ手順:
  1. GCP Console → Billing → Budgets & Alerts で予算 $5 を作成
     - 通知チャンネル: Pub/Sub トピック (例: "budget-alerts")
     - しきい値: 50%, 80%, 100%, 140%
  2. Cloud Function をデプロイ:
     gcloud functions deploy stop_billing \
       --runtime python312 \
       --trigger-topic budget-alerts \
       --set-env-vars GCP_PROJECT_ID=<your-project-id> \
       --source gcp/disable-billing/
  3. Cloud Billing API を有効化 & Cloud Function に権限付与:
     - roles/billing.admin (プロジェクトの課金リンク解除に必要)
"""

import base64
import json
import logging
import os

from google.cloud import billing_v1

logger = logging.getLogger(__name__)

PROJECT_ID = os.environ.get("GCP_PROJECT_ID")
PROJECT_NAME = f"projects/{PROJECT_ID}"


def stop_billing(data: dict, context) -> None:  # type: ignore[type-arg]
    """Pub/Sub トリガー: 予算アラートを受信して課金を停止する。"""
    pubsub_data = base64.b64decode(data["data"]).decode("utf-8")
    budget_notification = json.loads(pubsub_data)

    cost_amount = budget_notification.get("costAmount", 0)
    budget_amount = budget_notification.get("budgetAmount", 0)

    if budget_amount <= 0:
        logger.warning("Invalid budget amount: %s", budget_amount)
        return

    ratio = cost_amount / budget_amount
    logger.info(
        "Budget notification: cost=$%.2f, budget=$%.2f, ratio=%.0f%%",
        cost_amount, budget_amount, ratio * 100,
    )

    # 100% 超過で課金停止
    if ratio >= 1.0:
        logger.warning("Budget exceeded! Disabling billing for %s", PROJECT_NAME)
        _disable_billing()
    else:
        logger.info("Under budget (%.0f%%), no action needed", ratio * 100)


def _disable_billing() -> None:
    """プロジェクトの課金アカウントリンクを解除する。"""
    client = billing_v1.CloudBillingClient()
    project_billing = client.get_project_billing_info(name=PROJECT_NAME)

    if not project_billing.billing_enabled:
        logger.info("Billing already disabled for %s", PROJECT_NAME)
        return

    # billing_account_name を空にすると課金リンクが解除される
    project_billing.billing_account_name = ""
    client.update_project_billing_info(
        name=PROJECT_NAME,
        project_billing_info=project_billing,
    )
    logger.warning("Billing DISABLED for %s", PROJECT_NAME)
