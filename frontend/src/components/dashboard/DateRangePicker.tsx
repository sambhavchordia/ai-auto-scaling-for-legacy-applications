import React from 'react';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { cn } from '../../lib/utils';

interface DateRangePickerProps {
  dateRange: { start: Date; end: Date };
  onDateRangeChange: (range: { start: Date; end: Date }) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ 
  dateRange, 
  onDateRangeChange 
}) => {
  const [open, setOpen] = React.useState(false);

  const quickRanges = [
    {
      label: 'Last 24 hours',
      range: () => ({
        start: subDays(new Date(), 1),
        end: new Date()
      })
    },
    {
      label: 'Last 7 days',
      range: () => ({
        start: subDays(new Date(), 7),
        end: new Date()
      })
    },
    {
      label: 'Last 30 days',
      range: () => ({
        start: subDays(new Date(), 30),
        end: new Date()
      })
    }
  ];

  return (
    <div className="flex items-center space-x-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.start ? (
              dateRange.end ? (
                <>
                  {format(dateRange.start, "LLL dd, y")} -{" "}
                  {format(dateRange.end, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.start, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="flex">
            <div className="border-r border-border p-3 space-y-2">
              <p className="text-sm font-medium text-foreground">Quick Select</p>
              {quickRanges.map((range, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => {
                    const newRange = range.range();
                    onDateRangeChange(newRange);
                    setOpen(false);
                  }}
                >
                  {range.label}
                </Button>
              ))}
            </div>
            <div className="p-3">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.start}
                selected={{
                  from: dateRange?.start,
                  to: dateRange?.end,
                }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    onDateRangeChange({
                      start: range.from,
                      end: range.to,
                    });
                    setOpen(false);
                  }
                }}
                numberOfMonths={2}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};