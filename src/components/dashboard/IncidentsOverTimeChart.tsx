
"use client"

import * as React from "react"
import { Bar, BarChart, Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Ticket } from "@/types"
import type { DateFilterValue } from "./DashboardDateFilters"
import {
  format,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  eachMonthOfInterval,
  differenceInDays,
  min as minDate,
  max as maxDate,
  isValid,
  isWithinInterval,
} from "date-fns"

interface IncidentsOverTimeChartProps {
  tickets: Ticket[]
  dateFilter: DateFilterValue
}

interface ChartDataItem {
  date: string // Formatted date string for X-axis
  count: number
  originalDate: Date // Store original date for sorting
}

const chartConfig = {
  incidents: {
    label: "Incidents",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function IncidentsOverTimeChart({ tickets, dateFilter }: IncidentsOverTimeChartProps) {
  const processedChartData = React.useMemo(() => {
    if (dateFilter.type === 'daily' && dateFilter.date && isValid(dateFilter.date)) {
      const dayTickets = tickets.filter(t => {
        const ticketDate = new Date(t.receivedAt);
        return isValid(ticketDate) && format(ticketDate, "yyyy-MM-dd") === format(dateFilter.date!, "yyyy-MM-dd");
      });
      return [{
        date: format(dateFilter.date!, "MMM d"),
        count: dayTickets.length,
        originalDate: startOfDay(dateFilter.date!)
      }];
    }

    let startDate: Date | undefined;
    let endDate: Date | undefined;
    let granularity: "day" | "month" = "day";

    if (dateFilter.type === 'monthly' && dateFilter.month !== undefined && dateFilter.year !== undefined) {
      const baseDate = new Date(dateFilter.year, dateFilter.month);
      if (!isValid(baseDate)) return [];
      startDate = startOfMonth(baseDate);
      endDate = endOfMonth(baseDate);
      granularity = "day";
    } else if (dateFilter.type === 'yearly' && dateFilter.year !== undefined) {
      const baseDate = new Date(dateFilter.year, 0, 1);
      if (!isValid(baseDate)) return [];
      startDate = startOfYear(baseDate);
      endDate = endOfYear(baseDate);
      granularity = "month";
    } else if (dateFilter.type === 'period' && dateFilter.startDate && dateFilter.endDate) {
      if(!isValid(dateFilter.startDate) || !isValid(dateFilter.endDate)) return [];
      startDate = startOfDay(dateFilter.startDate);
      endDate = endOfDay(dateFilter.endDate);
      const diff = differenceInDays(endDate, startDate);
      granularity = diff <= 90 ? "day" : "month";
    } else if (dateFilter.type === 'allTime') {
      if (tickets.length === 0) return [];
      const dates = tickets.map(t => new Date(t.receivedAt)).filter(isValid);
      if (dates.length === 0) return [];
      startDate = startOfDay(minDate(dates));
      endDate = endOfDay(maxDate(dates));
      const diff = differenceInDays(endDate, startDate);
      granularity = diff <= 90 ? "day" : "month";
    }

    if (!startDate || !endDate || !isValid(startDate) || !isValid(endDate)) {
      return [];
    }
    
    const dateMap = new Map<string, number>();
    const intervalDates: Date[] = granularity === 'day'
        ? eachDayOfInterval({ start: startDate, end: endDate })
        : eachMonthOfInterval({ start: startDate, end: endDate });

    intervalDates.forEach(d => {
        const key = granularity === 'day' ? format(d, "yyyy-MM-dd") : format(d, "yyyy-MM");
        dateMap.set(key, 0);
    });
    
    tickets.forEach(ticket => {
      const received = new Date(ticket.receivedAt);
      if (!isValid(received) || !isWithinInterval(received, {start: startDate!, end: endDate!})) return;

      const key = granularity === 'day' ? format(received, "yyyy-MM-dd") : format(received, "yyyy-MM");
      dateMap.set(key, (dateMap.get(key) || 0) + 1);
    });

    const chartData: ChartDataItem[] = [];
    dateMap.forEach((count, dateStr) => {
        let displayFormat = "MMM d";
        let originalDt: Date;

        if (granularity === 'month') {
            displayFormat = "MMM yyyy";
            const [year, month] = dateStr.split('-').map(Number);
            originalDt = startOfMonth(new Date(year, month -1));
        } else { // day granularity
            const [year, month, day] = dateStr.split('-').map(Number);
            originalDt = new Date(year, month - 1, day);
        }
        
        chartData.push({
            date: format(originalDt, displayFormat),
            count,
            originalDate: originalDt
        });
    });

    return chartData.sort((a,b) => a.originalDate.getTime() - b.originalDate.getTime());

  }, [tickets, dateFilter]);

  if (dateFilter.type === 'daily' && processedChartData.length === 1 && dateFilter.date && isValid(dateFilter.date)) {
    return (
       <Card>
        <CardHeader>
          <CardTitle>Incidents on {processedChartData[0].date}</CardTitle>
          <CardDescription>Total new incidents reported on this day.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] pb-0">
          {processedChartData[0].count > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processedChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={true}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={true} tickMargin={8} allowDecimals={false} width={30} />
                <ChartTooltip
                  cursor={true}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={4} barSize={Math.min(60, processedChartData.length * 10)} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">No new incidents reported on {processedChartData[0].date}.</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
  
  if (!processedChartData || processedChartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Incident Trends Over Time</CardTitle>
          <CardDescription>Number of new incidents reported over the selected period.</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-muted-foreground">No data available for the selected period to display a trend.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incident Trends Over Time</CardTitle>
        <CardDescription>Number of new incidents reported over the selected period.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] pb-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart
            accessibilityLayer
            data={processedChartData}
            margin={{
              top: 5,
              right: 20, 
              left: -20, 
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3"/>
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={true}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={true}
              tickMargin={8}
              allowDecimals={false}
              width={30}
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="count"
              type="monotone"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={{
                r: 3, // Smaller dots
                fill: "hsl(var(--chart-1))",
                strokeWidth: 1,
              }}
              activeDot={{
                r: 5, // Slightly larger active dot
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
