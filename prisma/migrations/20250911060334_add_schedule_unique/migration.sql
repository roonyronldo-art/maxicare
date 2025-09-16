/*
  Warnings:

  - A unique constraint covering the columns `[dayOfWeek]` on the table `Schedule` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Schedule_dayOfWeek_key" ON "public"."Schedule"("dayOfWeek");
