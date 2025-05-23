
"use client"

import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { startOfMonth, endOfMonth, startOfYear, endOfYear, subDays, isValid } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export type DateFilterType = 'allTime' | 'daily' | 'monthly' | 'yearly' | 'period';

export interface DateFilterValue {
  type: DateFilterType;
  date?: Date;
  month?: number;
  year?: number;
  startDate?: Date;
  endDate?: Date;
}

interface DashboardDateFiltersProps {
  onApplyFilters: (filter: DateFilterValue) => void;
  currentFilterType: DateFilterType;
}

export default function DashboardDateFilters({ onApplyFilters, currentFilterType }: DashboardDateFiltersProps) {
  const [filterType, setFilterType] = useState<DateFilterType>(currentFilterType);
  const [dailyDate, setDailyDate] = useState<Date | undefined>(new Date());
  const [monthlyDate, setMonthlyDate] = useState<Date | undefined>(new Date());
  const [yearlyDate, setYearlyDate] = useState<Date | undefined>(new Date());
  const [periodStartDate, setPeriodStartDate] = useState<Date | undefined>(subDays(new Date(), 7));
  const [periodEndDate, setPeriodEndDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const handleApply = () => {
    let filterValue: DateFilterValue = { type: filterType };

    switch (filterType) {
      case 'daily':
        if (!dailyDate || !isValid(dailyDate)) {
            toast({ title: "Invalid Date", description: "Please select a valid date for daily filter.", variant: "destructive" });
            return;
        }
        filterValue = { type: 'daily', date: dailyDate };
        break;
      case 'monthly':
        if (!monthlyDate || !isValid(monthlyDate)) {
            toast({ title: "Invalid Date", description: "Please select a valid month and year.", variant: "destructive" });
            return;
        }
        filterValue = { type: 'monthly', month: monthlyDate.getMonth(), year: monthlyDate.getFullYear() };
        break;
      case 'yearly':
         if (!yearlyDate || !isValid(yearlyDate)) {
            toast({ title: "Invalid Date", description: "Please select a valid year.", variant: "destructive" });
            return;
        }
        filterValue = { type: 'yearly', year: yearlyDate.getFullYear() };
        break;
      case 'period':
        if (!periodStartDate || !periodEndDate || !isValid(periodStartDate) || !isValid(periodEndDate)) {
            toast({ title: "Invalid Dates", description: "Please select valid start and end dates for the period.", variant: "destructive" });
            return;
        }
        if (periodEndDate < periodStartDate) {
            toast({ title: "Invalid Period", description: "End date cannot be before start date.", variant: "destructive" });
            return;
        }
        filterValue = { type: 'period', startDate: periodStartDate, endDate: periodEndDate };
        break;
      case 'allTime':
      default:
        filterValue = { type: 'allTime' };
        break;
    }
    onApplyFilters(filterValue);
  };
  
  const handleReset = () => {
    setFilterType('allTime');
    setDailyDate(new Date());
    setMonthlyDate(new Date());
    setYearlyDate(new Date());
    setPeriodStartDate(subDays(new Date(), 7));
    setPeriodEndDate(new Date());
    onApplyFilters({ type: 'allTime' });
  }

  return (
    <Card className="mb-4 shadow-md">
      <CardHeader className="pb-3 pt-4 px-4">
        <CardTitle className="text-lg">Filter by Timeframe</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-3 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-end">
          <div className="space-y-1">
            <Label htmlFor="filter-type" className="text-xs">Filter Type</Label>
            <Select value={filterType} onValueChange={(value) => setFilterType(value as DateFilterType)}>
              <SelectTrigger id="filter-type" className="h-9">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="allTime">All Time</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="period">Specific Period</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filterType === 'daily' && (
            <div className="space-y-1">
              <Label htmlFor="daily-date" className="text-xs">Select Date</Label>
              <DatePicker date={dailyDate} setDate={setDailyDate} />
            </div>
          )}

          {filterType === 'monthly' && (
            <div className="space-y-1">
              <Label htmlFor="monthly-date" className="text-xs">Select Month & Year</Label>
              <DatePicker 
                  date={monthlyDate} 
                  setDate={setMonthlyDate} 
                  placeholder="Pick a month"
              />
            </div>
          )}

          {filterType === 'yearly' && (
            <div className="space-y-1">
              <Label htmlFor="yearly-date" className="text-xs">Select Year</Label>
              <DatePicker 
                  date={yearlyDate}
                  setDate={setYearlyDate}
                  placeholder="Pick a year"
              />
            </div>
          )}

          {filterType === 'period' && (
            <>
              <div className="space-y-1">
                <Label htmlFor="start-date" className="text-xs">Start Date</Label>
                <DatePicker date={periodStartDate} setDate={setPeriodStartDate} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="end-date" className="text-xs">End Date</Label>
                <DatePicker date={periodEndDate} setDate={setPeriodEndDate} 
                  disabled={(date) => periodStartDate ? date < periodStartDate : false}
                />
              </div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-0 pb-4 px-4">
        {filterType !== 'allTime' && (
             <Button variant="outline" size="sm" onClick={handleReset}>Reset</Button>
        )}
        <Button onClick={handleApply} size="sm" disabled={filterType === 'allTime' && currentFilterType === 'allTime'}>Apply</Button>
      </CardFooter>
    </Card>
  );
}
