import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { JerseyHero } from "@/components/jersey/JerseyHero";
import { JerseyContestParticipation } from "@/components/contest/JerseyContestParticipation";
import { ContestPopupWrapper } from "@/components/contest/ContestPopupWrapper";
import { ShopSection } from "@/components/shop/ShopSection";
import { JerseyFooter } from "@/components/jersey/JerseyFooter";
import { getJerseyImage } from "@/lib/utils";
import { AddToJerseydexButton } from "@/components/jersey/AddToJerseydexButton";
import { RemoveIsAuthParam } from "@/components/RemoveIsAuthParam";

interface JerseyPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ isAuth?: string }>;
}

export default async function JerseyPage({
  params,
  searchParams,
}: JerseyPageProps) {
  // 1. Récupération des données
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const isAuth = resolvedSearchParams?.isAuth === "true";

  const jersey = await prisma.jersey.findUnique({
    where: { id },
    include: {
      scans: true,
    },
  });

  if (!jersey) {
    notFound();
  }

  // Récupérer le concours actif
  const now = new Date();
  const activeContest = await prisma.contest.findFirst({
    where: {
      status: "ACTIVE",
      startedAt: {
        lte: now,
      },
      OR: [{ endedAt: null }, { endedAt: { gte: now } }],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // 2. Calculs simples
  const jerseyImage = getJerseyImage(jersey);

  // 3. Rendu avec composants
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      <RemoveIsAuthParam />
      <div className="container mx-auto px-4 py-8">
        <JerseyHero
          jerseyName={jersey.name}
          jerseyImage={jerseyImage}
          isAuthentic={isAuth}
        />
        <div className="flex justify-center mt-6 mb-8">
          <AddToJerseydexButton jerseyId={jersey.id} />
        </div>
        <div className="mb-12">
          <JerseyContestParticipation
            jerseyId={jersey.id}
            activeContest={activeContest}
            isAuthentic={isAuth}
          />
        </div>
      </div>
      <ShopSection />
      <JerseyFooter />

      {/* Popup de concours */}
      <ContestPopupWrapper
        contest={activeContest}
        isAuthentic={isAuth}
        jerseyId={jersey.id}
      />
    </div>
  );
}
