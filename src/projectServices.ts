import { supabase } from './supabaseClient';

export const SBUILD_TENANT_ID = '00000000-0000-0000-0000-000000000002';

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  location: string;
  scale: string;
  image: string;
  materials: string[] | string;
  description: string;
  created_at?: string;
}

export async function getProjects(tenantId: string = SBUILD_TENANT_ID): Promise<ProjectItem[]> {
  try {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('template_type', 'project')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Lỗi getProjects từ Supabase:', error);
      return [];
    }

    if (!data || data.length === 0) return [];

    return data.map(item => {
      let parsed: any = {};
      try {
        parsed = typeof item.html_content === 'string' ? JSON.parse(item.html_content) : (item.html_content || {});
      } catch (e) {
        parsed = {};
      }

      const materialsVal = parsed.materials || item.materials || [];
      const materialsArr = Array.isArray(materialsVal) 
        ? materialsVal 
        : typeof materialsVal === 'string' 
          ? materialsVal.split(',').map((m: string) => m.trim()).filter(Boolean)
          : [];

      return {
        id: item.id,
        title: item.title || parsed.title || 'Dự án thi công',
        category: parsed.category || 'Chung cư cao cấp',
        location: parsed.location || '',
        scale: parsed.scale || '',
        image: parsed.image || parsed.cover_image || item.image_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop',
        materials: materialsArr,
        description: parsed.description || '',
        created_at: item.created_at
      };
    });
  } catch (err) {
    console.error('getProjects exception:', err);
    return [];
  }
}

export async function saveProject(project: Partial<ProjectItem>, tenantId: string = SBUILD_TENANT_ID): Promise<ProjectItem | null> {
  try {
    const title = project.title || 'Dự án mới';
    const slug = title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    
    // Ensure valid UUID format for id or let crypto generate one
    const id = (project.id && String(project.id).includes('-') && String(project.id).length > 20) 
      ? String(project.id) 
      : crypto.randomUUID();

    const payload = {
      id,
      tenant_id: tenantId,
      title,
      slug,
      template_type: 'project',
      html_content: JSON.stringify({
        id,
        title,
        category: project.category || 'Chung cư cao cấp',
        location: project.location || '',
        scale: project.scale || '',
        image: project.image || '',
        materials: project.materials || [],
        description: project.description || ''
      }),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('pages')
      .upsert(payload)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      category: project.category || 'Chung cư cao cấp',
      location: project.location || '',
      scale: project.scale || '',
      image: project.image || '',
      materials: project.materials || [],
      description: project.description || '',
      created_at: data.created_at
    };
  } catch (err) {
    console.error('saveProject exception:', err);
    return null;
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('deleteProject exception:', err);
    return false;
  }
}
