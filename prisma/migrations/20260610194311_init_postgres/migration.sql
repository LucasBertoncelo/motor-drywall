-- CreateTable
CREATE TABLE "InsumoPreco" (
    "id" TEXT NOT NULL,
    "chaveInsumo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "precoUnitario" DOUBLE PRECISION NOT NULL,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsumoPreco_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InsumoPreco_chaveInsumo_key" ON "InsumoPreco"("chaveInsumo");
