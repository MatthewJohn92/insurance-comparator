// components/MobileView.tsx
"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Check,
  X,
  FileDown,
  Gem,
  Award,
  Star,
  ChevronDown,
  Car,
  User,
} from "lucide-react";
import { ScoreIndicator, IconBadge } from "./ui/custom-components";
import useComparisonLogic from "@/hooks/useComparisonLogic";
import { insuranceData } from "@/app/data/insuranceData";
import { cn } from "@/lib/utils";

// --- TIPI E INTERFACCE ---
type InsuranceData = typeof insuranceData;
type OfferWithScores = ReturnType<
  typeof useComparisonLogic
>["sortedOffers"][number];
interface FiltersState {
  selectedCoverages: string[];
}

interface MobileViewProps {
  data: InsuranceData;
  offers: OfferWithScores[];
  filters: FiltersState;
  viewMode: "full" | "compact" | "summary";
  // 👇 MODIFICA: Aggiunta prop per notificare l'interazione
  onSummaryInteraction?: () => void;
}

// --- COMPONENTI INTERNI ---

// OfferNavigator (invariato)
interface OfferNavigatorProps {
  offers: OfferWithScores[];
  visibleOfferId: number | null;
  onNavigate: (offerId: number) => void;
}
const OfferNavigator: React.FC<OfferNavigatorProps> = ({
  offers,
  visibleOfferId,
  onNavigate,
}) => {
  const navContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (visibleOfferId && navContainerRef.current) {
      const activeLogoElement = navContainerRef.current.querySelector(
        `[data-offer-id="${visibleOfferId}"]`
      );
      if (activeLogoElement)
        activeLogoElement.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
    }
  }, [visibleOfferId]);

  return (
    <div className="relative bg-sidebar-foreground p-2">
      <div
        ref={navContainerRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide"
      >
        {offers.map((offer) => (
          <button
            key={offer.id}
            data-offer-id={offer.id}
            onClick={() => onNavigate(offer.id)}
            className={cn(
              "flex-shrink-0 p-2 rounded-md border-2 bg-background transition-all duration-300",
              visibleOfferId === offer.id
                ? "border-primary opacity-100"
                : "border-transparent opacity-50 hover:opacity-100 hover:border-muted-foreground/50"
            )}
          >
            <img
              src={offer.logo}
              alt={offer.company}
              className="h-6 object-contain"
            />
          </button>
        ))}
      </div>
      <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-sidebar-foreground to-transparent pointer-events-none" />
    </div>
  );
};

// OfferHeader (invariato)
interface OfferHeaderProps {
  offer: OfferWithScores | undefined;
  clientData: InsuranceData["cliente"];
}
const OfferHeader: React.FC<OfferHeaderProps> = ({ offer, clientData }) => {
  if (!offer) return null;
  return (
    <div className="bg-background shadow-lg">
      <div className="bg-sidebar-primary text-background p-2 flex items-center justify-between gap-4 text-xs font-medium border-b">
        <div className="flex items-center gap-2 truncate">
          <Car className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{clientData.prodotto}</span>
        </div>
        <div className="flex items-center gap-2 truncate">
          <User className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{clientData.nome}</span>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <img
            src={offer.logo}
            alt={`${offer.company} Logo`}
            className="h-8 object-contain"
          />
          <div className="text-3xl font-bold text-foreground">
            {offer.premium_annuale.toLocaleString("de-CH", {
              style: "currency",
              currency: "CHF",
            })}
          </div>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-lg font-semibold">{offer.company}</h3>
            <p className="text-sm text-muted-foreground">
              {offer.policyNumber}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Score:</span>
              <ScoreIndicator score={offer.finalScore} />
            </div>
            <div className="flex gap-1.5">
              {offer.isBestValue && (
                <IconBadge
                                  icon={Gem}
                                  title="Miglior Qualità/Prezzo"
                                  colorClass="text-amber-400" bgColorClass={""}                />
              )}
              {offer.isBestScore && (
                <IconBadge
                                  icon={Award}
                                  title="Miglior Punteggio"
                                  colorClass="text-teal-400" bgColorClass={""}                />
              )}
              {offer.isBestPrice && (
                <IconBadge
                                  icon={Star}
                                  title="Miglior Prezzo"
                                  colorClass="text-sky-400" bgColorClass={""}                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// MobileOfferCardContent
interface MobileOfferCardContentProps {
  offer: OfferWithScores;
  data: InsuranceData;
  filters: FiltersState;
  viewMode: "full" | "compact" | "summary";
  onVisible: (offerId: number) => void;
  onSummaryInteraction?: () => void;
}
const MobileOfferCardContent: React.FC<MobileOfferCardContentProps> = ({
  offer,
  data,
  filters,
  viewMode,
  onVisible,
  onSummaryInteraction,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {}
  );
  const showDetails = viewMode === "full";

  useEffect(() => {
    if (!cardRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onVisible(offer.id);
      },
      { threshold: 0.7 }
    );
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [offer.id, onVisible]);

  // 👇 MODIFICA 1: Corretta la logica per chiudere le categorie in 'summary' view.
  useEffect(() => {
    const allOpen = Object.fromEntries(
      data.categorieCoperture.map((c) => [c.nome, true])
    );
    const allClosed = Object.fromEntries(
      data.categorieCoperture.map((c) => [c.nome, false])
    );

    if (viewMode === "summary") {
      setOpenCategories(allClosed);
    } else {
      setOpenCategories(allOpen);
    }
  }, [viewMode, data.categorieCoperture]);

  // 👇 MODIFICA 2: `toggleCategory` ora notifica il genitore dell'interazione.
  const toggleCategory = (name: string) => {
    if (viewMode === "summary" && onSummaryInteraction) {
      onSummaryInteraction();
    }
    setOpenCategories((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const displayedCategories = useMemo(() => {
    const { selectedCoverages } = filters;
    if (selectedCoverages.length === 0) return data.categorieCoperture;
    return data.categorieCoperture
      .map((category) => ({
        ...category,
        microCoperture: category.microCoperture.filter((micro) =>
          selectedCoverages.includes(micro.id)
        ),
      }))
      .filter((category) => category.microCoperture.length > 0);
  }, [data.categorieCoperture, filters]);

  return (
    <div
      ref={cardRef}
      id={`offer-card-${offer.id}`}
      className="w-screen h-full flex-shrink-0 snap-center overflow-y-auto scrollbar-hide p-4 space-y-4 pb-24"
    >
      {displayedCategories.map((category) => (
        <Card key={category.nome} className="shadow-lg bg-muted/50">
          <CardHeader
            onClick={() => toggleCategory(category.nome)}
            className="flex flex-row justify-between items-center cursor-pointer p-3"
          >
            <CardTitle className="text-base">{category.nome}</CardTitle>
            <div className="flex items-center gap-4">
              <ScoreIndicator score={offer.macroScores[category.nome]} />
              <ChevronDown
                className={`transition-transform ${
                  openCategories[category.nome] ? "rotate-180" : ""
                }`}
              />
            </div>
          </CardHeader>
          {openCategories[category.nome] && (
            <CardContent className="p-0 border-t">
              <div className="divide-y divide-muted-foreground/20">
                {category.microCoperture.map((micro) => {
                  const coverage =
                    offer.coverages[micro.id as keyof typeof offer.coverages];
                  return (
                    <div
                      key={micro.id}
                      className="flex items-start justify-between p-3 bg-background"
                    >
                      <p className="w-1/2 pr-4 font-semibold text-sm">
                        {micro.nome}
                      </p>
                      <div className="w-1/2 flex flex-col items-end text-right text-sm">
                        {coverage && coverage.covered ? (
                          <>
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              <ScoreIndicator score={coverage.score} />
                            </div>
                            {showDetails && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {coverage.details}
                              </p>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <X className="h-4 w-4 text-red-500" />
                            <span>{coverage?.details || "Non inclusa"}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};

// --- COMPONENTE PRINCIPALE MOBILEVIEW ---
export default function MobileView({
  data,
  offers,
  filters,
  viewMode,
  onSummaryInteraction,
}: MobileViewProps) {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const [visibleOfferId, setVisibleOfferId] = useState<number | null>(
    offers[0]?.id ?? null
  );

  const handleNavigation = (offerId: number) => {
    const targetElement = mainContainerRef.current?.querySelector(
      `#offer-card-${offerId}`
    );
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const visibleOffer = useMemo(
    () => offers.find((o) => o.id === visibleOfferId),
    [offers, visibleOfferId]
  );

  if (offers.length === 0) {
    return (
      <div className="md:hidden flex items-center justify-center h-full">
        <p>Nessuna offerta trovata.</p>
      </div>
    );
  }

  const MAIN_HEADER_HEIGHT = 56;

  return (
    <Drawer>
      <div
        className="md:hidden flex flex-col bg-muted/30"
        style={{ height: `calc(100vh - ${MAIN_HEADER_HEIGHT}px)` }}
      >
        <header className="sticky top-0 z-10">
          <OfferNavigator
            offers={offers}
            visibleOfferId={visibleOfferId}
            onNavigate={handleNavigation}
          />
          <OfferHeader offer={visibleOffer} clientData={data.cliente} />
        </header>

        <main
          ref={mainContainerRef}
          className="flex-grow overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        >
          <div className="flex h-full">
            {offers.map((offer) => (
              <MobileOfferCardContent
                key={offer.id}
                offer={offer}
                data={data}
                filters={filters}
                viewMode={viewMode}
                onVisible={setVisibleOfferId}
                onSummaryInteraction={onSummaryInteraction} // Passa la prop al figlio
              />
            ))}
          </div>
        </main>
      </div>

      <DrawerTrigger asChild>
        <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center p-4 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none">
          <div className="w-20 h-2 bg-zinc-300 rounded-full pointer-events-auto cursor-pointer" />
        </div>
      </DrawerTrigger>

      <DrawerContent>
        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mt-4" />
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-xl">Osservazione Finale</DrawerTitle>
          <DrawerDescription className="pt-2">
            {visibleOffer?.osservazione}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button asChild>
            <a href={visibleOffer?.pdf_link} download>
              <FileDown className="mr-2 h-4 w-4" />
              Scarica Offerta PDF
            </a>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
