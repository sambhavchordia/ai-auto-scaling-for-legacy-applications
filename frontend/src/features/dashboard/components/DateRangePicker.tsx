import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  onRefresh?: () => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  dateRange,
  onDateRangeChange,
  onRefresh
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (!dateRange.from || (dateRange.from && dateRange.to)) {
      onDateRangeChange({ from: date, to: undefined });
    } else {
      if (date && date < dateRange.from) {
        onDateRangeChange({ from: date, to: dateRange.from });
      } else {
        onDateRangeChange({ from: dateRange.from, to: date });
      }
    }
  };

  const handleQuickSelect = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    onDateRangeChange({ from: start, to: end });
    setIsOpen(false);
  };

  const handleClear = () => {
    onDateRangeChange({ from: undefined, to: undefined });
    setIsOpen(false);
  };

  const formatDateRange = () => {
    if (!dateRange.from) return 'Select date range';
    if (!dateRange.to) return format(dateRange.from, 'MMM dd, yyyy');
    return `${format(dateRange.from, 'MMM dd, yyyy')} - ${format(dateRange.to, 'MMM dd, yyyy')}`;
  };

  const isDateSelected = (date: Date) => {
    if (!dateRange.from) return false;
    if (!dateRange.to) return format(date, 'yyyy-MM-dd') === format(dateRange.from, 'yyyy-MM-dd');
    return date >= dateRange.from && date <= dateRange.to;
  };

  const isDateInRange = (date: Date) => {
    if (!dateRange.from || !dateRange.to) return false;
    return date > dateRange.from && date < dateRange.to;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Date Range</span>
          </div>
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              className="h-6 px-2"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Date Range Picker */}
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDateRange()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    onDateRangeChange(range);
                    setIsOpen(false);
                  }
                }}
                numberOfMonths={2}
                className="rounded-md border"
                modifiers={{
                  selected: (date) => isDateSelected(date),
                  inRange: (date) => isDateInRange(date),
                }}
                modifiersStyles={{
                  selected: { backgroundColor: 'hsl(var(--primary))', color: 'white' },
                  inRange: { backgroundColor: 'hsl(var(--primary) / 0.1)' },
                }}
              />
            </PopoverContent>
          </Popover>

          {/* Quick Select Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSelect(1)}
              className="text-xs"
            >
              Last 24h
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSelect(7)}
              className="text-xs"
            >
              Last 7 days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSelect(30)}
              className="text-xs"
            >
              Last 30 days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSelect(90)}
              className="text-xs"
            >
              Last 90 days
            </Button>
          </div>

          {/* Selected Range Display */}
          {dateRange.from && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {dateRange.from && dateRange.to ? (
                    <>
                      {format(dateRange.from, 'MMM dd')} - {format(dateRange.to, 'MMM dd, yyyy')}
                    </>
                  ) : (
                    format(dateRange.from, 'MMM dd, yyyy')
                  )}
                </Badge>
                {dateRange.from && dateRange.to && (
                  <span className="text-xs text-muted-foreground">
                    {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} days
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-6 px-2 text-xs"
              >
                Clear
              </Button>
            </div>
          )}

          {/* Time Presets */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Time Presets</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const now = new Date();
                  const start = new Date(now);
                  start.setHours(0, 0, 0, 0);
                  onDateRangeChange({ from: start, to: now });
                }}
                className="text-xs justify-start"
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const now = new Date();
                  const start = new Date(now);
                  start.setDate(start.getDate() - 1);
                  start.setHours(0, 0, 0, 0);
                  const end = new Date(now);
                  end.setHours(0, 0, 0, 0);
                  onDateRangeChange({ from: start, to: end });
                }}
                className="text-xs justify-start"
              >
                Yesterday
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const now = new Date();
                  const start = new Date(now);
                  start.setDate(start.getDate() - start.getDay());
                  start.setHours(0, 0, 0, 0);
                  onDateRangeChange({ from: start, to: now });
                }}
                className="text-xs justify-start"
              >
                This Week
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const now = new Date();
                  const start = new Date(now.getFullYear(), now.getMonth(), 1);
                  onDateRangeChange({ from: start, to: now });
                }}
                className="text-xs justify-start"
              >
                This Month
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


