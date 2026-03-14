import type { BlogPost } from '../../types';
import { getBlogPostPath } from '../../utils/catalog';
import SmartLink from '../SmartLink';
import { useSiteContent } from '../../contexts/SiteContentContext';

interface BlogProps {
  posts: BlogPost[];
}

export default function Blog({ posts }: BlogProps) {
  const { settings } = useSiteContent();
  const section = settings.home.blogSection;

  if (!section.isVisible || posts.length === 0) {
    return null;
  }

  return (
    <section className="blog-section" id="blog">
      <div className="container">
        <div className="sec-head">
          <div>
            <div className="sec-title">{section.title}</div>
            <div className="sec-sub">{section.subtitle}</div>
          </div>
          {section.ctaLabel && section.ctaHref ? (
            <SmartLink href={section.ctaHref} className="view-all">
              {section.ctaLabel} <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
            </SmartLink>
          ) : null}
        </div>
        <div className="blog-grid">
          {posts.map((post, index) => (
            <div key={post.id} className={`blog-card ${index === 0 ? 'blog-main' : 'blog-sm'}`}>
              <div className="blog-thumb">
                <div
                  className="blog-thumb-bg"
                  style={{
                    background:
                      index === 0
                        ? 'linear-gradient(135deg,var(--d2),rgba(255,107,0,0.06))'
                        : 'linear-gradient(135deg,var(--d2),rgba(34,197,94,0.05))',
                    color: 'rgba(255,107,0,0.22)',
                    height: index === 0 ? undefined : '170px',
                  }}
                >
                  <svg className="thumb-icon" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <span className="blog-cat bc-safety">{post.category}</span>
              </div>
              <div className="blog-body">
                <div className="blog-meta">
                  <span>{new Date(post.publishedAt).toLocaleDateString('ar-EG')}</span>
                  <span>{post.author}</span>
                  <span>{post.readTime ?? 4} دقائق</span>
                </div>
                <div className="blog-title">{post.title}</div>
                <div className="blog-excerpt">{post.excerpt}</div>
                <SmartLink href={getBlogPostPath(post)} className="blog-read">
                  اقرأ المزيد <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
                </SmartLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
