import React from 'react';
import { Link } from 'react-router-dom';

export default function CtaDuo() {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-duo">
          <div className="cta-card cta-s">
            <span className="c-eyebrow">للموردين والشركات المصنّعة</span>
            <h3>انضم كمورد على منصة الريان</h3>
            <p>وسّع نطاق أعمالك وتواصل مع آلاف الشركات والمشترين الصناعيين في مصر.</p>
            <div className="cta-feats">
              <div className="cta-feat"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>لوحة تحكم متكاملة لإدارة المنتجات والطلبات</div>
              <div className="cta-feat"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>وصول فوري لقاعدة عملاء ضخمة</div>
              <div className="cta-feat"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>دعم تسويقي ومبيعات مخصص</div>
              <div className="cta-feat"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>تسوية مدفوعات سريعة وآمنة</div>
            </div>
            <Link to="/vendor/register" className="btn-primary">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9zm0 0l1.5-5h15L21 9"/></svg>
              سجّل كمورد الآن
            </Link>
            <svg className="cta-bg-svg" width="220" height="220" viewBox="0 0 220 220"><path d="M110 10 L210 60 L210 160 L110 210 L10 160 L10 60 Z" fill="none" stroke="#0984e3" strokeWidth="1.5" opacity=".4"/><path d="M110 40 L180 75 L180 145 L110 180 L40 145 L40 75 Z" fill="none" stroke="#0984e3" strokeWidth=".8" opacity=".3"/></svg>
          </div>
          <div className="cta-card cta-b">
            <span className="c-eyebrow">للشركات والمشترين B2B</span>
            <h3>حساب أعمال مميز</h3>
            <p>استمتع بأسعار الجملة وعروض حصرية وخدمة عملاء مخصصة لاحتياجات شركتك.</p>
            <div className="cta-feats">
              <div className="cta-feat"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>أسعار خاصة للشركات والمصانع</div>
              <div className="cta-feat"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>فاتورة ضريبية معتمدة لكل طلب</div>
              <div className="cta-feat"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>مدير حساب مخصص لخدمتك</div>
              <div className="cta-feat"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>توصيل مجدوَل ومدار للمواقع</div>
            </div>
            <Link to="/b2b/register" className="btn-primary">
              <svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              افتح حساب أعمال
            </Link>
            <svg className="cta-bg-svg" width="220" height="220" viewBox="0 0 220 220"><circle cx="110" cy="110" r="100" fill="none" stroke="#FF6B00" strokeWidth="1.5" opacity=".3"/><circle cx="110" cy="110" r="70" fill="none" stroke="#FF6B00" strokeWidth=".8" strokeDasharray="5 4" opacity=".3"/></svg>
          </div>
        </div>
      </div>
    </section>
  );
}
