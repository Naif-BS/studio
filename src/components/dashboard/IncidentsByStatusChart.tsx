
"use client"

import * as React from "react"
import { Pie, PieChart, ResponsiveContainer } from "recharts"

import type { Ticket } from "@/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig
} from "@/components/ui/chart"
import { ticketStatusDisplay } from "@/types"


interface IncidentsByStatusChartProps {
  tickets: Ticket[]
}

export default function IncidentsByStatusChart({ tickets }: IncidentsByStatusChartProps) {
  const chartData = React.useMemo(() => {
    const statusCounts = tickets.reduce((acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1
      return acc
    }, {} as Record<Ticket["status"], number>)

    return Object.entries(statusCounts).map(([status, count]) => ({
      status: ticketStatusDisplay[status as Ticket["status"]] || status,
      count: count,
      fill: `hsl(var(--chart-${Object.keys(ticketStatusDisplay).indexOf(status as Ticket["status"]) + 1}))`
    }))
  }, [tickets])

  const chartConfig = React.useMemo(() => {
     const config: ChartConfig = {};
     chartData.forEach((item, index) => {
        config[item.status] = {
            label: item.status,
            color: `hsl(var(--chart-${index + 1}))`
        }
     });
     return config;
  }, [chartData]);


  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Incident Status Distribution</CardTitle>
          <CardDescription>Breakdown of incidents by their current status.</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-muted-foreground">No data available for the selected period.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incident Status Distribution</CardTitle>
        <CardDescription>Breakdown of incidents by their current status for the selected period.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
            </Pie>
            <ChartLegend
                content={<ChartLegendContent nameKey="status" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
