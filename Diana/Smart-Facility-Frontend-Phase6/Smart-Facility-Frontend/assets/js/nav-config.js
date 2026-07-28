/**
 * nav-config.js
 * The static-frontend equivalent of the Django context processor from the
 * Django-templates build: one source of truth for each role's sidebar nav
 * and identity, rendered client-side by sidebar.js instead of server-side.
 *
 * When this project connects to a real backend, ROLE_CONFIG below maps
 * directly onto server-rendered context — the role key comes from
 * document.body.dataset.role, which a backend can set from the session/user.
 * Until then, pages set it manually: <body data-role="construction_manager" data-active-page="construction-dashboard">
 */

export const ICONS = {
  dashboard: '<rect x="4" y="4" width="7" height="7" rx="1.5" fill="var(--primary-tint)"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5" fill="var(--primary-tint)"/>',
  projects: '<rect x="4" y="8" width="13" height="11" rx="2" fill="var(--primary-tint)"/><rect x="7" y="5" width="13" height="11" rx="2"/><circle class="node" cx="20" cy="5" r="1.8"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 20c.6-4 2.7-6 5.5-6s4.9 2 5.5 6" stroke="var(--babyblue)"/><circle cx="17" cy="7" r="2.4" stroke="var(--coolgray-soft)"/><path d="M15 20c.3-2.6 1.6-4.2 3-4.6" stroke="var(--coolgray-soft)"/>',
  permissions: '<circle cx="9" cy="9" r="5"/><path d="M12.3 12.3 20 20M16 16l2-2M19 19l2-2" stroke="var(--primary)"/><circle class="node" cx="9" cy="9" r="1.5"/>',
  stages: '<rect x="4" y="15" width="4" height="5" rx="1"/><rect x="10" y="10" width="4" height="10" rx="1"/><rect x="16" y="5" width="4" height="15" rx="1" fill="var(--primary-tint)" stroke="var(--primary)"/><circle class="node" cx="18" cy="3" r="1.8"/>',
  progress: '<circle cx="12" cy="12" r="8.5"/><path d="M12 6v6l4 2" stroke="var(--babyblue)"/><circle class="node" cx="12" cy="12" r="1.4"/>',
  materials: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M12 3v9m0 9v-9m-8-4.5L12 12l8-4.5" stroke="var(--babyblue)"/><circle class="node" cx="12" cy="12" r="1.5"/>',
  material_requests: '<rect x="6" y="4" width="12" height="17" rx="2"/><rect x="9" y="2.5" width="6" height="3" rx="1"/><path d="M9 11h6M9 15h4" stroke="var(--babyblue)"/><circle class="node" cx="17" cy="17" r="1.8"/>',
  quality: '<path d="M12 3l7 3v6c0 5-3 8-7 9-4-1-7-4-7-9V6l7-3z" fill="var(--success-tint)"/><path d="M9 12l2 2 4-4.5" stroke="var(--success)"/><circle class="node" cx="18" cy="6" r="1.8"/>',
  reports: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 15V10M12 15V7M16 15v-3.5" stroke="var(--primary)"/><circle class="node" cx="19" cy="5" r="1.8"/>',
  documents: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z"/><path d="M14 3v5h5" stroke="var(--babyblue)"/><circle class="node" cx="17" cy="19" r="1.8"/>',
  facilities: '<rect x="4" y="6" width="16" height="15" rx="2"/><path d="M4 11h16M9 6v-2m6 2v-2" stroke="var(--babyblue)"/><circle class="node" cx="19" cy="4" r="1.8"/>',
  assets: '<path d="M12 3l7 4v10l-7 4-7-4V7l7-4z"/><path d="M5 7l7 4 7-4M12 11v10" stroke="var(--babyblue)"/><circle class="node" cx="12" cy="11" r="1.6"/>',
  asset_health: '<circle cx="12" cy="12" r="7"/><path d="M12 8v4l2.5 2.5" stroke="var(--babyblue)"/><circle class="node" cx="12" cy="12" r="1.6"/>',
  maintenance: '<circle cx="12" cy="12" r="4.5"/><path d="M12 3v2.4M12 18.6V21M21 12h-2.4M5.4 12H3M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5" stroke="var(--babyblue)"/><circle class="node" cx="12" cy="12" r="1.5"/>',
  preventive: '<path d="M4 12a8 8 0 0 1 14-5"/><path d="M20 12a8 8 0 0 1-14 5" stroke="var(--babyblue)"/><path d="M18 4v4h-4M6 20v-4h4"/><circle class="node" cx="18" cy="4" r="1.5"/>',
  corrective: '<path d="M14.5 6.5l3 3L9 18l-4 1 1-4z"/><path d="M13 8l3 3" stroke="var(--babyblue)"/><circle class="node" cx="19" cy="5" r="1.6"/>',
  work_orders: '<rect x="6" y="4" width="12" height="17" rx="2"/><rect x="9" y="2.5" width="6" height="3" rx="1"/><path d="M9 11h6M9 15h4" stroke="var(--babyblue)"/><circle class="node" cx="17" cy="17" r="1.8"/>',
  faults: '<path d="M12 3l8.5 3.5v6c0 5.5-3.6 8.5-8.5 10.5-4.9-2-8.5-5-8.5-10.5v-6L12 3z"/><path d="M12 9v5" stroke="var(--critical)"/><circle class="node-critical" cx="12" cy="17" r="1.1"/>',
  security_alert: '<path d="M12 3l8.5 3.5v6c0 5.5-3.6 8.5-8.5 10.5-4.9-2-8.5-5-8.5-10.5v-6L12 3z"/><path d="M12 9v5" stroke="var(--critical)"/><circle class="node-critical" cx="12" cy="17" r="1.1"/>',
  emergency: '<circle cx="12" cy="12" r="9"/><path d="M12 16l-6-6 6-6M6 10h12" stroke="var(--critical)" transform="rotate(90 12 10)"/><circle class="node-critical" cx="12" cy="12" r="1.4"/>',
  incidents: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5 13.4 10 20 12l-6.6 2-1.4 6.5L10.6 14 4 12l6.6-2z" fill="var(--critical-tint)" stroke="var(--critical)"/><circle class="node-critical" cx="12" cy="12" r="1.1"/>',
  response: '<path d="M5 13l4 4L19 7"/><circle cx="12" cy="12" r="9" stroke="var(--babyblue)"/><circle class="node" cx="19" cy="5" r="1.6"/>',
  event_log: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M8 13h8M8 17h5" stroke="var(--babyblue)"/><circle class="node" cx="19" cy="5" r="1.6"/>',
  notifications: '<path d="M6 10a6 6 0 0 1 12 0v4l2 3H4l2-3v-4z"/><path d="M10 20a2.2 2.2 0 0 0 4 0" stroke="var(--babyblue)"/><circle class="node" cx="18" cy="7" r="1.6"/>',
  settings: '<path d="M4 7h10M4 12h16M4 17h7"/><circle cx="16" cy="7" r="2.1" fill="var(--primary-tint)" stroke="var(--primary)"/><circle cx="9" cy="17" r="2.1" fill="var(--accent-tint)" stroke="var(--accent)"/><circle class="node" cx="20" cy="12" r="1.5"/>',
  analytics: '<path d="M4 18c1.5-6 5-6.5 5-9.5A3 3 0 1 0 6 8" stroke="var(--babyblue)"/><path d="M20 18c-1.5-6-5-6.5-5-9.5" stroke="var(--coolgray)"/><circle cx="14" cy="7" r="3"/><circle class="node" cx="17" cy="3.5" r="2"/>',
  audit: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M8 13h8M8 17h5"/><circle class="node" cx="19" cy="5" r="1.8"/>',
};

// Each nav item: [label, href, pageId, iconKey]
export const ROLE_CONFIG = {
  super_admin: {
    labelAr: 'المدير التنفيذي', labelEn: 'Super Admin', avatar: 'إد', name: 'سارة العتيبي',
    nav: [
      { title: 'نظرة عامة', items: [
        ['لوحة القيادة التنفيذية', '../super-admin/dashboard.html', 'super-admin-dashboard', 'dashboard'],
        ['المشاريع', '../super-admin/projects.html', 'super-admin-projects', 'projects'],
        ['المستخدمون', '../super-admin/users.html', 'super-admin-users', 'users'],
        ['الأدوار والصلاحيات', '../super-admin/roles-permissions.html', 'super-admin-roles', 'permissions'],
      ]},
      { title: 'النظام', items: [
        ['مركز التقارير', '../super-admin/reports.html', 'super-admin-reports', 'reports'],
        ['التحليلات', '../super-admin/analytics.html', 'super-admin-analytics', 'analytics'],
        ['سجل التدقيق', '../super-admin/audit-logs.html', 'super-admin-audit', 'audit'],
        ['إعدادات النظام', '../super-admin/settings.html', 'super-admin-settings', 'settings'],
      ]},
    ],
  },

  construction_manager: {
    labelAr: 'مدير الإنشاءات', labelEn: 'Construction Manager', avatar: 'خش', name: 'خالد الشمري',
    nav: [
      { title: 'نظرة عامة', items: [
        ['لوحة التحكم الإنشائية', '../construction-manager/dashboard.html', 'construction-dashboard', 'dashboard'],
        ['المشاريع الإنشائية', '../construction-manager/projects.html', 'construction-projects', 'projects'],
      ]},
      { title: 'التنفيذ والجدولة', items: [
        ['مراحل التنفيذ', '../construction-manager/stages.html', 'construction-stages', 'stages'],
        ['متابعة التقدم', '../construction-manager/progress.html', 'construction-progress', 'progress'],
        ['الجدول الزمني', '../construction-manager/project-timeline.html', 'construction-timeline', 'progress'],
      ]},
      { title: 'الموارد', items: [
        ['إدارة المواد', '../construction-manager/materials.html', 'construction-materials', 'materials'],
        ['طلبات المواد', '../construction-manager/material-requests.html', 'construction-material-requests', 'material_requests'],
      ]},
      { title: 'الجودة والتوثيق', items: [
        ['فحوصات الجودة', '../construction-manager/quality-inspections.html', 'construction-quality', 'quality'],
        ['التقارير اليومية', '../construction-manager/daily-reports.html', 'construction-daily-reports', 'reports'],
        ['الوثائق والملفات', '../construction-manager/documents.html', 'construction-documents', 'documents'],
        ['صور الموقع والمرفقات', '../construction-manager/site-photos.html', 'construction-photos', 'documents'],
      ]},
    ],
  },

  operations_manager: {
    labelAr: 'مدير التشغيل', labelEn: 'Operations Manager', avatar: 'رد', name: 'ريم الدوسري',
    nav: [
      { title: 'نظرة عامة', items: [
        ['لوحة التشغيل الرئيسية', '../operations-manager/dashboard.html', 'operations-dashboard', 'dashboard'],
      ]},
      { title: 'المنشآت والأصول', items: [
        ['المنشآت', '../operations-manager/facilities.html', 'operations-facilities', 'facilities'],
        ['إدارة الأصول', '../operations-manager/assets.html', 'operations-assets', 'assets'],
        ['مركز صحة الأصول', '../operations-manager/asset-health-center.html', 'operations-asset-health', 'asset_health'],
      ]},
      { title: 'الصيانة', items: [
        ['أوامر الصيانة', '../operations-manager/maintenance-orders.html', 'operations-maintenance-orders', 'maintenance'],
        ['الصيانة الوقائية', '../operations-manager/preventive-maintenance.html', 'operations-preventive', 'preventive'],
        ['الصيانة التصحيحية', '../operations-manager/corrective-maintenance.html', 'operations-corrective', 'corrective'],
        ['تقويم الصيانة', '../operations-manager/maintenance-calendar.html', 'operations-calendar', 'preventive'],
      ]},
      { title: 'الأداء والتقارير', items: [
        ['تتبع الأعطال', '../operations-manager/fault-tracking.html', 'operations-faults', 'faults'],
        ['كفاءة أداء المنشآت', '../operations-manager/facility-performance.html', 'operations-performance', 'analytics'],
        ['التقارير التشغيلية', '../operations-manager/operational-reports.html', 'operations-reports', 'reports'],
      ]},
    ],
  },

  security_officer: {
    labelAr: 'ضابط الأمن', labelEn: 'Security Officer', avatar: 'فع', name: 'فيصل العنزي',
    nav: [
      { title: 'نظرة عامة', items: [
        ['لوحة التحكم الأمنية', '../security-officer/dashboard.html', 'security-dashboard', 'dashboard'],
      ]},
      { title: 'المراقبة والتنبيه', items: [
        ['التنبيهات الأمنية الحيّة', '../security-officer/alerts.html', 'security-alerts', 'security_alert'],
        ['سجل التنبيهات', '../security-officer/alert-history.html', 'security-alert-history', 'event_log'],
        ['مركز مراقبة الكاميرات', '../security-officer/camera-monitoring.html', 'security-cameras', 'security_alert'],
        ['المراقبة الطارئة', '../security-officer/emergency-monitoring.html', 'security-emergency', 'emergency'],
      ]},
      { title: 'الحوادث والاستجابة', items: [
        ['إدارة الحوادث', '../security-officer/incidents.html', 'security-incidents', 'incidents'],
        ['مركز الاستجابة', '../security-officer/response-center.html', 'security-response', 'response'],
      ]},
      { title: 'التحليلات والتقارير', items: [
        ['تحليلات الحوادث', '../security-officer/incident-analytics.html', 'security-analytics', 'analytics'],
        ['التقارير الأمنية', '../security-officer/security-reports.html', 'security-reports', 'reports'],
      ]},
      { title: 'التوثيق', items: [
        ['الوثائق والسلامة', '../security-officer/safety-documentation.html', 'security-documents', 'documents'],
      ]},
    ],
  },
};
