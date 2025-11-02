import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ruc = searchParams.get('numero');

  if (!ruc || ruc.length !== 11) {
    return NextResponse.json(
      { error: 'RUC inválido. Debe tener 11 dígitos.' },
      { status: 400 }
    );
  }

  try {
    // Using a public API for RUC lookup
    const response = await fetch(
      `https://api.apis.net.pe/v2/sunat/ruc/full?numero=${ruc}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'No se encontró información para este RUC.' },
        { status: 404 }
      );
    }

    const data = await response.json();

    // Transform the response to match our interface
    const result = {
      ruc: data.numeroDocumento || ruc,
      razonSocial: data.nombre || data.razonSocial || 'No disponible',
      estado: data.estado || 'No disponible',
      condicion: data.condicion || 'No disponible',
      direccion: data.direccion || 'No disponible',
      ubigeo: data.ubigeo || 'No disponible',
      tipoContribuyente: data.tipoDocumento || 'No disponible',
      fechaInscripcion: data.fechaInscripcion || 'No disponible',
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching RUC data:', error);
    return NextResponse.json(
      { error: 'Error al consultar la información. Por favor, intente nuevamente.' },
      { status: 500 }
    );
  }
}
