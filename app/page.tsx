"use client"

import { Suspense } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { VacationSummaryCard } from "@/components/vacation-summary"
import { VacationCard } from "@/components/vacation-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { PlusCircle, Calendar } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "@/hooks/use-translations"
import type { Vacation } from "@/types"

// This would normally come from a server component or API
const mockSummary = {
  used: 7,
  remaining: 14,
  pending: 3,
  total: 21,
}

// This would normally come from a server component or API
const mockVacations = [
  {
    id: "1",
    user_id: "123e4567-e89b-12d3-a456-426614174000",
    vacation_type_id: 1,
    start_date: "2024-05-10",
    end_date: "2024-05-15",
    notes: "Annual family trip",
    status: "approved",
    created_at: "2024-04-01",
    updated_at: "2024-04-02",
    vacation_type: {
      id: 1,
      name: "Regular",
      description: "Standard vacation days",
      color: "#4CAF50",
      icon: "palm-tree",
      created_at: "2024-01-01",
    },
  },
  {
    id: "2",
    user_id: "123e4567-e89b-12d3-a456-426614174000",
    vacation_type_id: 2,
    start_date: "2024-06-20",
    end_date: "2024-06-20",
    notes: "Doctor appointment",
    status: "pending",
    created_at: "2024-04-15",
    updated_at: "2024-04-15",
    vacation_type: {
      id: 2,
      name: "Casual",
      description: "Short-term casual leave",
      color: "#ADD8E6",
      icon: "coffee",
      created_at: "2024-01-01",
    },
  },
  {
    id: "3",
    user_id: "123e4567-e89b-12d3-a456-426614174000",
    vacation_type_id: 3,
    start_date: "2024-07-05",
    end_date: "2024-07-07",
    notes: "Feeling unwell",
    status: "pending",
    created_at: "2024-04-20",
    updated_at: "2024-04-20",
    vacation_type: {
      id: 3,
      name: "Sick",
      description: "Health-related leave",
      color: "#FF8A65",
      icon: "stethoscope",
      created_at: "2024-01-01",
    },
  },
] as any

function VacationListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <div className="h-2 bg-muted" />
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-32 mt-1" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-4 w-full mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function Home() {
  const { t } = useTranslations()

  return (
    <MainLayout>
      <div className="container py-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">
                {t("dashboard.welcome").replace("{name}", "John")}
              </h1>
              <Link href="/add-vacation">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t("dashboard.newVacation")}
                </Button>
              </Link>
            </div>

            <Tabs defaultValue="upcoming">
              <TabsList>
                <TabsTrigger value="upcoming">{t("dashboard.upcoming")}</TabsTrigger>
                <TabsTrigger value="pending">{t("dashboard.pending")}</TabsTrigger>
                <TabsTrigger value="past">{t("dashboard.past")}</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming" className="space-y-4 mt-4">
                <Suspense fallback={<VacationListSkeleton />}>
                  {mockVacations.map((vacation: Vacation) => (
                    <VacationCard key={vacation.id} vacation={vacation} />
                  ))}
                </Suspense>
              </TabsContent>
              <TabsContent value="pending" className="space-y-4 mt-4">
                <Suspense fallback={<VacationListSkeleton />}>
                  {mockVacations
                    .filter((v: Vacation) => v.status === "pending")
                    .map((vacation: Vacation) => (
                      <VacationCard key={vacation.id} vacation={vacation} />
                    ))}
                </Suspense>
              </TabsContent>
              <TabsContent value="past" className="space-y-4 mt-4">
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">{t("dashboard.noVacations")}</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="md:w-1/3 space-y-6">
            <VacationSummaryCard summary={mockSummary} />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("dashboard.quickActions")}</CardTitle>
                <CardDescription>
                  {t("dashboard.quickActionsDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/add-vacation">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t("dashboard.requestVacation")}
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/calendar">
                    <Calendar className="mr-2 h-4 w-4" />
                    {t("dashboard.viewCalendar")}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
