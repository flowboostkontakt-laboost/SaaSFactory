import { TreasuryRepository } from "@/server/repositories/treasury-repository";

const treasuryRepository = new TreasuryRepository();

export function getTreasurySummary() {
  return treasuryRepository.getSummary();
}

export function listTransactions(projectId?: string) {
  return treasuryRepository.listTransactions(projectId);
}
