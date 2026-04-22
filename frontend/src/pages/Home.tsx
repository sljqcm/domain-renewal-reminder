import { Link } from 'react-router-dom';
import { BrandLogo } from '../components/logo';

const coreCapabilities = [
  {
    title: '把域名集中记清',
    description: '把域名、到期时间、续费地址、提醒邮箱和负责人放到同一个面板，不再散落在表格、备忘录和聊天记录里。',
  },
  {
    title: '到期前自动提醒',
    description: '系统会按你设定的节奏每天检查，并在接近到期时提醒你处理，减少忘记续费的风险。',
  },
  {
    title: '处理过程可追踪',
    description: '支持提醒中、已处理、已暂停、已放弃等状态；续费后自动进入下一轮，并保留备注和处理记录。',
  },
];

const operatingHighlights = [
  ['域名清单', '就是把所有域名放在一个地方统一查看、搜索和分组。'],
  ['自动提醒', '就是系统在到期前按计划提醒你，不用自己盯日历。'],
  ['续费接续', '就是标记已续费后，系统自动重算下一轮到期和提醒时间。'],
  ['后台配置', '就是管理员可以配置邮件服务、查看日志并手动触发检查。'],
];

const processSteps = [
  '先注册账户，再添加域名，或者通过 CSV / AI 识别批量导入。',
  '系统自动计算到期时间、提醒开始时间和提醒次数。',
  '处理人跟进后更新状态、备注和处理时间。',
  '完成续费后，一键进入下一轮提醒周期。',
];

export function Home() {
  return (
    <div className="app-shell ink-wash-bg landing-shell landing-shell--executive">
      <div className="ink-pattern" />
      <div className="landing-orb landing-orb--one" />
      <div className="landing-orb landing-orb--two" />

      <header className="app-topbar landing-topbar landing-topbar--minimal">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <BrandLogo title="爱自由域名管理" subtitle="Domain Renewal Reminder Service" />
          <nav className="landing-nav landing-nav--minimal" aria-label="Homepage actions">
            <a
              href="https://github.com/zhikanyeye/domain-renewal-reminder"
              target="_blank"
              rel="noreferrer"
              className="landing-icon-link"
              aria-label="GitHub repository"
              title="GitHub repository"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.59 2 12.25c0 4.528 2.865 8.37 6.839 9.727.5.096.682-.223.682-.495 0-.244-.009-.89-.014-1.747-2.782.62-3.369-1.39-3.369-1.39-.455-1.192-1.11-1.51-1.11-1.51-.908-.638.069-.625.069-.625 1.004.073 1.532 1.058 1.532 1.058.892 1.566 2.341 1.114 2.91.852.091-.667.349-1.115.635-1.371-2.22-.26-4.555-1.14-4.555-5.074 0-1.121.39-2.038 1.03-2.757-.104-.261-.447-1.312.097-2.735 0 0 .84-.276 2.75 1.053A9.303 9.303 0 0 1 12 6.838c.85.004 1.706.118 2.504.347 1.909-1.329 2.748-1.053 2.748-1.053.545 1.423.202 2.474.099 2.735.64.719 1.028 1.636 1.028 2.757 0 3.944-2.339 4.811-4.566 5.066.359.319.679.948.679 1.912 0 1.381-.012 2.494-.012 2.833 0 .274.18.596.688.494C19.138 20.616 22 16.776 22 12.25 22 6.59 17.523 2 12 2Z" />
              </svg>
            </a>
            <Link to="/login" className="primary-button landing-entry-button">
              登录
            </Link>
          </nav>
        </div>
      </header>

      <main className="app-main landing-main landing-main--single">
        <section className="home-brief animate-slideUp">
          <div className="home-brief__hero">
            <p className="home-brief__eyebrow">域名续费管理，不靠记忆</p>
            <h1 className="home-brief__title">把域名记录、提醒和续费处理放到一个地方</h1>
            <p className="home-brief__description">
              爱自由域名管理帮助你记清每个域名什么时候到期、谁在处理、是否已经续费，适合个人站长、工作室和小团队长期使用。
            </p>
            <div className="home-brief__annotation">
              <span>支持 CSV 与 AI 批量导入</span>
              <span>支持状态、备注、处理人和处理时间记录</span>
              <span>续费后自动进入下一轮提醒</span>
            </div>
            <div className="button-row">
              <Link to="/register" className="primary-button">
                先注册开始使用
              </Link>
              <Link to="/login" className="secondary-button">
                已有账户，直接登录
              </Link>
            </div>
            <p className="home-brief__subaction">如果你是第一次使用，建议先注册，再批量导入或手动录入域名。</p>
          </div>

          <aside className="home-brief__summary" aria-label="Product summary">
            <div className="home-summary-block">
              <div className="home-summary-block__label">适合谁</div>
              <p>适合自己管域名的人，也适合 2 到 10 人左右需要协作处理续费提醒的小团队。</p>
            </div>
            <div className="home-summary-block">
              <div className="home-summary-block__label">怎么开始</div>
              <p>注册账户后，录入域名或批量导入，系统就会自动开始计算到期时间和提醒计划。</p>
            </div>
            <div className="home-summary-block">
              <div className="home-summary-block__label">技术方式</div>
              <p>系统运行在 Cloudflare Workers、D1、KV 与 Pages 上，不需要你自己维护服务器。</p>
            </div>
          </aside>
        </section>

        <section className="home-sheet animate-slideUp" aria-label="Homepage details">
          <div className="home-sheet__column">
            <div className="home-sheet__heading">你能做什么</div>
            <div className="home-feature-list">
              {coreCapabilities.map((item) => (
                <article key={item.title} className="home-feature-item">
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="home-sheet__column">
            <div className="home-sheet__heading">怎么运转</div>
            <ol className="home-process-list">
              {processSteps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>

          <div className="home-sheet__column">
            <div className="home-sheet__heading">页面里这些词是什么意思</div>
            <dl className="home-definition-list">
              {operatingHighlights.map(([term, detail]) => (
                <div key={term} className="home-definition-item">
                  <dt>{term}</dt>
                  <dd>{detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
    </div>
  );
}
