-- AlterTable
ALTER TABLE "public"."Appointment" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."LabUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
