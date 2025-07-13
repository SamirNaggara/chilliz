import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Statistiques principales
    const [
      totalParticipations,
      totalWinners,
      activeContests,
      recentParticipations,
      recentWinners,
    ] = await Promise.all([
      // Total participations avec transaction blockchain
      prisma.participation.count({
        where: {
          blockchainTxHash: {
            not: null,
          },
        },
      }),

      // Total gagnants annoncés sur blockchain
      prisma.winner.count({
        where: {
          blockchainTxHash: {
            not: null,
          },
        },
      }),

      // Concours actifs
      prisma.contest.count({
        where: {
          status: "ACTIVE",
        },
      }),

      // Participations récentes (dernières 24h)
      prisma.participation.findMany({
        where: {
          blockchainTxHash: {
            not: null,
          },
          blockchainTimestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
        select: {
          blockchainTxHash: true,
          blockchainTimestamp: true,
          blockchainConfirmed: true,
          contestId: true,
          username: true,
        },
        orderBy: {
          blockchainTimestamp: "desc",
        },
        take: 20,
      }),

      // Gagnants récents (dernières 24h)
      prisma.winner.findMany({
        where: {
          blockchainTxHash: {
            not: null,
          },
          blockchainTimestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
        select: {
          blockchainTxHash: true,
          blockchainTimestamp: true,
          blockchainConfirmed: true,
          contestId: true,
        },
        orderBy: {
          blockchainTimestamp: "desc",
        },
        take: 20,
      }),
    ]);

    // Combiner les transactions récentes
    const recentTransactions = [
      ...recentParticipations.map((p) => ({
        hash: p.blockchainTxHash!,
        type: "LOTTERY_PARTICIPATION",
        timestamp: p.blockchainTimestamp!.getTime(),
        contestId: p.contestId,
        status: p.blockchainConfirmed
          ? ("confirmed" as const)
          : ("pending" as const),
        username: p.username || null,
      })),
      ...recentWinners.map((w) => ({
        hash: w.blockchainTxHash!,
        type: "WINNER_ANNOUNCEMENT",
        timestamp: w.blockchainTimestamp!.getTime(),
        contestId: w.contestId,
        status: w.blockchainConfirmed
          ? ("confirmed" as const)
          : ("pending" as const),
      })),
    ].sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json({
      success: true,
      data: {
        totalParticipations,
        totalWinners,
        activeContests,
        recentTransactions,
      },
    });
  } catch (error) {
    console.error("Erreur récupération stats blockchain:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
