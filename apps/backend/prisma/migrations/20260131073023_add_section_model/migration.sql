-- CreateEnum
CREATE TYPE "SECTION_TYPE" AS ENUM ('HERO', 'PROMOTIONAL', 'BENEFITS', 'NEW_ARRIVALS');

-- CreateTable
CREATE TABLE "Section" (
    "id" SERIAL NOT NULL,
    "type" "SECTION_TYPE" NOT NULL DEFAULT 'HERO',
    "title" TEXT,
    "description" TEXT,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "icons" TEXT,
    "link" TEXT,
    "ctaText" TEXT,
    "isVisible" BOOLEAN DEFAULT false,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Section_id_key" ON "Section"("id");

-- CreateIndex
CREATE INDEX "Section_type_idx" ON "Section"("type");
