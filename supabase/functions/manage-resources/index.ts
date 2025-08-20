import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, admin-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type ResourceData = {
  title: string;
  description?: string | null;
  file_url?: string | null;
  file_type: string;
  file_size?: number | null;
  category: string;
  tags?: string[];
  is_featured?: boolean;
  author_name?: string;
};

type RequestBody = {
  action: 'create' | 'update' | 'delete';
  id?: string;
  resource_data?: ResourceData;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('manage-resources 함수 시작 - Method:', req.method);
    
    // Admin token 검증
    const adminToken = req.headers.get('admin-token');
    if (!adminToken) {
      console.log('인증 토큰 누락');
      return new Response(JSON.stringify({ success: false, message: '인증 토큰이 필요합니다' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('토큰 검증 시작');
    const authResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/secure-admin-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
      },
      body: JSON.stringify({ action: 'validate', token: adminToken }),
    });

    if (!authResponse.ok) {
      console.log('토큰 검증 HTTP 실패:', authResponse.status);
      return new Response(JSON.stringify({ success: false, message: '토큰 검증 실패' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const authResult = await authResponse.json();
    if (!authResult.success) {
      console.log('토큰 검증 결과 실패:', authResult.message);
      return new Response(JSON.stringify({ success: false, message: '인증 실패: 관리자 권한이 필요합니다' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('토큰 검증 성공');

    const { action, id, resource_data }: RequestBody = await req.json();
    console.log('요청 데이터:', { action, id, resource_data: resource_data ? '존재' : '없음' });

    if (!action) {
      return new Response(JSON.stringify({ success: false, message: 'action이 필요합니다' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    let result: any = null;

    if (action === 'create') {
      console.log('자료 생성 시작');
      if (!resource_data || !resource_data.title || !resource_data.category || !resource_data.file_type) {
        console.log('필수 필드 누락:', { 
          has_resource_data: !!resource_data,
          has_title: resource_data?.title,
          has_category: resource_data?.category,
          has_file_type: resource_data?.file_type
        });
        return new Response(JSON.stringify({ success: false, message: '필수 필드 누락: title, category, file_type' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const insertData = {
        title: resource_data.title,
        description: resource_data.description ?? null,
        category: resource_data.category,
        file_url: resource_data.file_url ?? null,
        file_type: resource_data.file_type,
        file_size: resource_data.file_size ?? null,
        tags: resource_data.tags || [],
        is_featured: !!resource_data.is_featured,
        author_name: resource_data.author_name || '알프GOGOGO',
      };

      console.log('DB 삽입 시작:', insertData);

      const { data, error } = await supabase
        .from('resources')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.log('DB 삽입 오류:', error);
        throw error;
      }
      
      console.log('자료 생성 성공:', data?.id);
      result = data;
    } else if (action === 'update') {
      console.log('자료 수정 시작:', id);
      if (!id || !resource_data) {
        console.log('수정용 필수 데이터 누락:', { has_id: !!id, has_resource_data: !!resource_data });
        return new Response(JSON.stringify({ success: false, message: 'id와 resource_data가 필요합니다' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const updateData: any = { ...resource_data };
      if (typeof updateData.tags !== 'undefined') {
        updateData.tags = updateData.tags || [];
      }
      updateData.updated_at = new Date().toISOString();

      console.log('DB 수정 시작:', { id, updateData });

      const { data, error } = await supabase
        .from('resources')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.log('DB 수정 오류:', error);
        throw error;
      }
      
      console.log('자료 수정 성공:', data?.id);
      result = data;
    } else if (action === 'delete') {
      console.log('자료 삭제 시작:', id);
      if (!id) {
        console.log('삭제용 ID 누락');
        return new Response(JSON.stringify({ success: false, message: 'id가 필요합니다' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { error } = await supabase.from('resources').delete().eq('id', id);
      if (error) {
        console.log('DB 삭제 오류:', error);
        throw error;
      }
      
      console.log('자료 삭제 성공:', id);
      result = { id };
    } else {
      return new Response(JSON.stringify({ success: false, message: `알 수 없는 action: ${action}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('작업 완료, 응답 전송');
    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('manage-resources 함수 오류:', error);
    
    // 더 구체적인 오류 메시지 제공
    let userMessage = '서버 오류가 발생했습니다.';
    let httpStatus = 500;
    
    if (error.code === '23505') {
      userMessage = '중복된 데이터가 있습니다. 잠시 후 다시 시도하세요.';
      httpStatus = 409;
    } else if (error.code === '23503') {
      userMessage = '참조하는 데이터가 존재하지 않습니다.';
      httpStatus = 400;
    } else if (error.code === '42704') {
      userMessage = '데이터베이스 제약 조건에 문제가 있습니다. 관리자에게 문의하세요.';
      httpStatus = 500;
    } else if (error.message?.includes('JWT')) {
      userMessage = '인증이 만료되었습니다. 다시 로그인하세요.';
      httpStatus = 401;
    } else if (error.message) {
      userMessage = error.message;
    }
    
    return new Response(JSON.stringify({ 
      success: false, 
      message: userMessage,
      error_code: error.code || 'UNKNOWN',
      error_details: error.message || '알 수 없는 오류'
    }), {
      status: httpStatus,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
