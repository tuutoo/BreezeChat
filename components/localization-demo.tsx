"use client"

import { useLocale } from "@/hooks/use-locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

export default function LocalizationDemo() {
  const {
    locale,
    formatLocalDate,
    formatLocalNumber,
    formatLocalRelativeTime
  } = useLocale()

  // Use state to store date values and only set them on client side
  const [dates, setDates] = useState<{
    now: Date | null,
    yesterday: Date | null,
    tomorrow: Date | null
  }>({
    now: null,
    yesterday: null,
    tomorrow: null
  })

  // Use client-side effect to set dates after hydration
  useEffect(() => {
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)

    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)

    setDates({
      now,
      yesterday,
      tomorrow
    })
  }, [])

  const price = 1234567.89
  const percentage = 0.1234
  const smallNumber = 0.0000123

  // Only render the component after hydration
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient || !dates.now) {
    return null // Return nothing during server-side rendering or before dates are set
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Localization Demo</CardTitle>
        <CardDescription>Current locale: {locale}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <h3 className="text-lg font-semibold">Dates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="p-2 rounded border">
              <p className="text-sm text-muted-foreground">Default date:</p>
              <p>{formatLocalDate(dates.now)}</p>
            </div>
            <div className="p-2 rounded border">
              <p className="text-sm text-muted-foreground">Short date:</p>
              <p>{formatLocalDate(dates.now, { dateStyle: 'short' })}</p>
            </div>
            <div className="p-2 rounded border">
              <p className="text-sm text-muted-foreground">Time only:</p>
              <p>{formatLocalDate(dates.now, { timeStyle: 'medium', hour12: true })}</p>
            </div>
            <div className="p-2 rounded border">
              <p className="text-sm text-muted-foreground">Full date and time:</p>
              <p>{formatLocalDate(dates.now, { dateStyle: 'full', timeStyle: 'long' })}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          <h3 className="text-lg font-semibold">Numbers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="p-2 rounded border">
              <p className="text-sm text-muted-foreground">Currency:</p>
              <p>{formatLocalNumber(price, { style: 'currency', currency: 'USD' })}</p>
            </div>
            <div className="p-2 rounded border">
              <p className="text-sm text-muted-foreground">Percentage:</p>
              <p>{formatLocalNumber(percentage, { style: 'percent' })}</p>
            </div>
            <div className="p-2 rounded border">
              <p className="text-sm text-muted-foreground">Scientific notation:</p>
              <p>{formatLocalNumber(smallNumber, { notation: 'scientific' })}</p>
            </div>
            <div className="p-2 rounded border">
              <p className="text-sm text-muted-foreground">Compact format:</p>
              <p>{formatLocalNumber(1234567, { notation: 'compact' })}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          <h3 className="text-lg font-semibold">Relative Time</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="p-2 rounded border">
              <p className="text-sm text-muted-foreground">Yesterday:</p>
              <p>{formatLocalRelativeTime(-1, 'day')}</p>
            </div>
            <div className="p-2 rounded border">
              <p className="text-sm text-muted-foreground">Tomorrow:</p>
              <p>{formatLocalRelativeTime(1, 'day')}</p>
            </div>
            <div className="p-2 rounded border">
              <p className="text-sm text-muted-foreground">Hours ago:</p>
              <p>{formatLocalRelativeTime(-2, 'hour')}</p>
            </div>
            <div className="p-2 rounded border">
              <p className="text-sm text-muted-foreground">Next week:</p>
              <p>{formatLocalRelativeTime(1, 'week')}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
