import { ApiResponse } from "@/server/utils/api-response";
import { BlockchainService } from "@/server/services/blockchain.service";

export async function GET() {
  const blockchainService = new BlockchainService();
  const rpcHealthy = await blockchainService.isHealthy();
  const ledgerHealth = await blockchainService.getLedgerHealth();
  const degraded = ledgerHealth.ledgerAgeSeconds > 60;

  return ApiResponse.success(
    {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      ledger: ledgerHealth.ledger,
      ledgerAgeSeconds: ledgerHealth.ledgerAgeSeconds,
      status: !rpcHealthy ? "unhealthy" : degraded ? "degraded" : "healthy",
    },
    !rpcHealthy
      ? "System is unhealthy"
      : degraded
        ? "System is degraded"
        : "System is healthy"
  );
}
