-- CreateTable
CREATE TABLE "public"."ClinicConfig" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "heroImg" TEXT,
    "loginImg" TEXT,
    "registerImg" TEXT,

    CONSTRAINT "ClinicConfig_pkey" PRIMARY KEY ("id")
);
