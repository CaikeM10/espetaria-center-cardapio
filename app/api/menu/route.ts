import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const menuApiUrl = process.env.MENU_API_URL;

    if (!menuApiUrl) {
      throw new Error("MENU_API_URL não configurada.");
    }

    const response = await fetch(menuApiUrl, {
      cache: "no-store",
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok || !payload) {
      console.error(
        "Erro retornado pela API principal do cardápio:",
        response.status,
        payload,
      );

      return NextResponse.json(
        {
          error: "Não foi possível carregar o cardápio.",
        },
        {
          status: 502,
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    return NextResponse.json(payload, {
      status: 200,

      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Erro ao consultar o cardápio:", error);

    return NextResponse.json(
      {
        error: "Não foi possível carregar o cardápio.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
