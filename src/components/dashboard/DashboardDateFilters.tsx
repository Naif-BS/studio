
"use client"

import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { subDays, isValid } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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

  const datePickerTriggerClass = "h-8 text-xs";

  return (
    <div className="p-3 mb-4 border-b">
      {/* Row 1: Filter Type and Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        {/* Filter Type Select */}
        <div className="space-y-1.5 flex-1 sm:flex-none sm:w-52">
          <Label htmlFor="filter-type" className="text-xs">Filter Type</Label>
          <Select value={filterType} onValueChange={(value) => setFilterType(value as DateFilterType)}>
            <SelectTrigger id="filter-type" className={cn("bg-background border-input w-full", datePickerTriggerClass)}>
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

        {/* Spacer for sm+ screens to push buttons to the right */}
        <div className="hidden sm:block sm:flex-grow"></div>

        {/* Action Buttons */}
        <div className="flex sm:flex-none gap-1.5 self-end sm:self-end w-full sm:w-auto justify-end">
          {filterType !== 'allTime' && (
             <Button variant="outline" onClick={handleReset} className="h-8 text-xs px-2 flex-auto sm:flex-initial">Reset</Button>
          )}
          <Button onClick={handleApply} disabled={filterType === 'allTime' && currentFilterType === 'allTime'} className="h-8 text-xs px-3 flex-auto sm:flex-initial">Apply</Button>
        </div>
      </div>

      {/* Row 2: Conditional DatePickers (appears below the first row if needed) */}
      { (filterType !== 'allTime') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 items-end mt-3">
          {filterType === 'daily' && (
            <div className="space-y-1.5">
              <Label htmlFor="daily-date" className="text-xs">Select Date</Label>
              <DatePicker date={dailyDate} setDate={setDailyDate} triggerClassName={datePickerTriggerClass} />
            </div>
          )}

          {filterType === 'monthly' && (
            <div className="space-y-1.5">
              <Label htmlFor="monthly-date" className="text-xs">Select Month & Year</Label>
              <DatePicker 
                  date={monthlyDate} 
                  setDate={setMonthlyDate} 
                  placeholder="Pick a month"
                  triggerClassName={datePickerTriggerClass}
              />
            </div>
          )}

          {filterType === 'yearly' && (
            <div className="space-y-1.5">
              <Label htmlFor="yearly-date" className="text-xs">Select Year</Label>
              <DatePicker 
                  date={yearlyDate}
                  setDate={setYearlyDate}
                  placeholder="Pick a year"
                  triggerClassName={datePickerTriggerClass}
              />
            </div>
          )}

          {filterType === 'period' && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="start-date" className="text-xs">Start Date</Label>
                <DatePicker date={periodStartDate} setDate={setPeriodStartDate} triggerClassName={datePickerTriggerClass} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="end-date" className="text-xs">End Date</Label>
                <DatePicker date={periodEndDate} setDate={setPeriodEndDate} 
                  disabled={(date) => periodStartDate ? date < periodStartDate : false}
                  triggerClassName={datePickerTriggerClass}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
