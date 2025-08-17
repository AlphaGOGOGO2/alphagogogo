import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AIServiceRequest {
  action: 'create' | 'update' | 'delete' | 'toggle_active';
  service_id?: string;
  service_data?: {
    name: string;
    display_name: string;
    url_pattern: string;
    description: string;
    benefits: string[];
    is_active: boolean;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { action, service_id, service_data }: AIServiceRequest = await req.json();

    console.log('AI Services Management Request:', { action, service_id, service_data });

    let result;
    let message = '';

    switch (action) {
      case 'create':
        if (!service_data) {
          throw new Error('Service data is required for create operation');
        }
        
        // Validate required fields
        if (!service_data.name || !service_data.display_name || !service_data.url_pattern || !service_data.description) {
          throw new Error('Missing required fields: name, display_name, url_pattern, description');
        }

        result = await supabase
          .from('ai_services')
          .insert({
            name: service_data.name.trim(),
            display_name: service_data.display_name.trim(),
            url_pattern: service_data.url_pattern.trim(),
            description: service_data.description.trim(),
            benefits: service_data.benefits || [],
            is_active: service_data.is_active ?? true
          })
          .select()
          .single();
        
        message = 'AI service created successfully';
        break;

      case 'update':
        if (!service_id || !service_data) {
          throw new Error('Service ID and data are required for update operation');
        }
        
        result = await supabase
          .from('ai_services')
          .update({
            name: service_data.name.trim(),
            display_name: service_data.display_name.trim(),
            url_pattern: service_data.url_pattern.trim(),
            description: service_data.description.trim(),
            benefits: service_data.benefits || [],
            is_active: service_data.is_active ?? true,
            updated_at: new Date().toISOString()
          })
          .eq('id', service_id)
          .select()
          .single();
        
        message = 'AI service updated successfully';
        break;

      case 'delete':
        if (!service_id) {
          throw new Error('Service ID is required for delete operation');
        }
        
        // Check if service has associated invite links
        const { data: existingLinks } = await supabase
          .from('invite_links')
          .select('id')
          .eq('service_id', service_id)
          .limit(1);
        
        if (existingLinks && existingLinks.length > 0) {
          throw new Error('Cannot delete service with existing invite links. Please remove all invite links first.');
        }
        
        result = await supabase
          .from('ai_services')
          .delete()
          .eq('id', service_id);
        
        message = 'AI service deleted successfully';
        break;

      case 'toggle_active':
        if (!service_id) {
          throw new Error('Service ID is required for toggle operation');
        }
        
        // First get current status
        const { data: currentService } = await supabase
          .from('ai_services')
          .select('is_active')
          .eq('id', service_id)
          .single();
        
        if (!currentService) {
          throw new Error('Service not found');
        }
        
        result = await supabase
          .from('ai_services')
          .update({ 
            is_active: !currentService.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', service_id)
          .select()
          .single();
        
        message = `AI service ${!currentService.is_active ? 'activated' : 'deactivated'} successfully`;
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    if (result.error) {
      console.error('Supabase operation error:', result.error);
      throw result.error;
    }

    console.log('Operation completed successfully:', { action, message });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message,
        data: result.data 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in manage-ai-services function:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const statusCode = errorMessage.includes('not found') ? 404 : 
                      errorMessage.includes('required') || errorMessage.includes('Missing') ? 400 : 500;

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: statusCode,
      }
    );
  }
});