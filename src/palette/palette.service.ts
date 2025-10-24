import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class PaletteService {
  private supabase;

  constructor() {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('❌ Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
    }

    this.supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  }

  // 🧠 Guardar resultado del análisis IA
  async saveResult(data: {
    image_url: string;
    analisis: any;
    tiempo_respuesta_ms?: number;
    feedback_usuario?: any;
  }) {
    const { image_url, analisis, tiempo_respuesta_ms, feedback_usuario } = data;

    if (!image_url || !analisis) {
      throw new HttpException(
        'Los campos "image_url" y "analisis" son obligatorios',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { error } = await this.supabase
      .from('ia_results')
      .insert([
        {
          image_url,
          analisis,
          tiempo_respuesta_ms,
          feedback_usuario,
        },
      ]);

    if (error) {
      console.error('❌ Error insertando en ia_results:', error.message);
      throw new HttpException('Error al insertar en la tabla ia_results', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return { message: '✅ Resultado insertado correctamente en ia_results' };
  }

  // 📥 Obtener registros previos (por ejemplo, para ver últimos resultados)
  async getAllResults(limit = 10) {
    const { data, error } = await this.supabase
      .from('ia_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Error al consultar resultados: ${error.message}`);

    return data;
  }

  // 📤 (Opcional) Insertar registros validados de otra tabla como hacías antes
  async verifyAndInsertPalettes() {
    const { data: rawData, error: selectError } = await this.supabase
      .from('paletas_raw')
      .select('*');

    if (selectError) throw new Error(`Error leyendo tabla A: ${selectError.message}`);

    if (!rawData || rawData.length === 0)
      return { message: 'No hay registros para verificar' };

    const verifiedData = rawData.map((row) => ({
      nombre: row.nombre,
      hex: row.hex,
      fecha_validacion: new Date().toISOString(),
    }));

    const { error: insertError } = await this.supabase
      .from('paletas_validadas')
      .insert(verifiedData);

    if (insertError)
      throw new Error(`Error insertando en tabla B: ${insertError.message}`);

    return {
      message: `✅ ${verifiedData.length} registros verificados e insertados correctamente`,
    };
  }
}
