// QA harness for the blog-journey-inject.js fixes.
// Replicates the real live DOM shapes captured from www.berlinwalk.com on 2026-07-25.
import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';

const SCRIPT = readFileSync(
  process.env.BW_SCRIPT || '/Users/yusufucuz/Documents/New project/berlinwalk-widgets/_worktrees/blogfix-20260725/js/blog-journey-inject.js',
  'utf8',
);

const results = [];
function check(name, pass, detail = '') {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
}

const SITE_FOOTER = `
  <footer id="comp-mm3d90vg" class="comp-mm3d90vg">
    <section id="comp-mm3d90vg_r_comp-kbgakgyt" class="wixui-footer">
      <div id="bw-site-footer-restore" class="bw-site-footer" data-build="site-footer-restore-20260716a">
        <div class="bw-footer-inner">
          <div class="bw-footer-bottom"><span>© 2026 BerlinWalk.</span>
            <div class="bw-footer-bottom-links">
              <a href="https://www.berlinwalk.com/">berlinwalk.com</a>
              <button type="button" data-bw-privacy-settings="true">Privacy Settings</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </footer>`;

// Wix blog post end-matter, as observed live: tags + views + like inside
// footer[data-hook="post-footer"], native share icons, and (per Yusuf's SS2)
// the native comments module with commenting closed.
const POST_FOOTER = `
  <footer data-hook="post-footer" class="PhCafd B6ltWa">
    <div class="PKQ95p">
      <span>Tags:</span><a href="/blog/categories/tourist-tips">Tourist Tips</a><a href="/blog/categories/tour-route">Tour Route</a>
      <span>66 views</span><span>0 comments</span><span>Post not marked as liked</span>
    </div>
    <div class="share-row">
      <a href="#" aria-label="Share via Facebook">f</a>
      <a href="#" aria-label="Share via X (Twitter)">X</a>
      <a href="#" aria-label="Share via link">link</a>
      <button aria-label="Print Post">print</button>
    </div>
    <div class="wix-comments-wrapper">
      <div class="comments-head"><h2>Comments</h2></div>
      <div class="comments-empty-box">
        <span class="icon"></span>
        <p>Commenting on this post isn't available anymore. Contact the site owner for more info.</p>
      </div>
    </div>
  </footer>`;

function postPageHtml({ withSiteFooter = true, withComments = true } = {}) {
  return `<!doctype html><html><body>
    <div id="SITE_CONTAINER">
      <div data-hook="post" class="post">
        <header class="PhCafd"><h1>Berlin Courtyards</h1></header>
        <div data-hook="post-content" class="post-content"><p>Body paragraph one.</p><p>Body paragraph two.</p><p>Body paragraph three.</p><h2>A real article heading</h2><p>Body paragraph four.</p></div>
        ${withComments ? POST_FOOTER : POST_FOOTER.replace(/<div class="wix-comments-wrapper">[\s\S]*?<\/div>\s*<\/footer>/, '</footer>')}
      </div>
    </div>
    ${withSiteFooter ? SITE_FOOTER : ''}
  </body></html>`;
}

function blogIndexHtml({ withSiteFooter = false } = {}) {
  return `<!doctype html><html><body>
    <div id="comp-mppyg3dv">
      <bw-blog-index><section class="bw-blog-index"><div class="bw-blog-index-root">
        <div class="bw-cards">card</div>
        <footer class="bw-footer-band"><div class="bw-inner"><h2>Want Berlin to click in real life?</h2>
          <a href="/book">BOOK YOUR FREE SPOT</a></div></footer>
      </div></section></bw-blog-index>
    </div>
    ${withSiteFooter ? SITE_FOOTER : ''}
  </body></html>`;
}

async function boot(html, url) {
  const dom = new JSDOM(html, {
    url,
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });
  const { window } = dom;
  window.requestIdleCallback = (cb) => window.setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 }), 0);
  window.cancelIdleCallback = (id) => window.clearTimeout(id);
  window.fetch = () => Promise.reject(new Error('no data in harness'));
  window.eval(SCRIPT);
  // let the timed passes (250ms/1000ms/1500ms) and DOM-ready work run
  await new Promise((r) => setTimeout(r, 2200));
  return dom;
}

const hidden = (el) => el && el.getAttribute('data-bw-native-blog-end-hidden') === '1';
const text = (el) => (el?.textContent || '').replace(/\s+/g, ' ').trim();

// ---------------------------------------------------------------- scenario 1
// Post page, site footer already mounted: privacy control stays in the site
// footer only, comments module hidden, tags/views/share untouched.
{
  const dom = await boot(postPageHtml(), 'https://www.berlinwalk.com/post/berlin-courtyards-hoefe');
  const doc = dom.window.document;
  const marked = [...doc.querySelectorAll('[data-bw-privacy-settings]')];
  check('post: exactly one privacy control', marked.length === 1, `found ${marked.length}`);
  check(
    'post: privacy control lives in the site footer',
    marked.every((b) => b.closest('#bw-site-footer-restore')),
    marked.map((b) => b.parentElement?.className || b.parentElement?.tagName).join(' | '),
  );
  check(
    'post: no privacy control inside post-footer',
    !doc.querySelector('footer[data-hook="post-footer"] .bw-privacy-settings-link'),
  );

  const commentsWrapper = doc.querySelector('.wix-comments-wrapper');
  check('post: native comments wrapper hidden', hidden(commentsWrapper), commentsWrapper?.outerHTML.slice(0, 60));
  check('post: tags/views row still visible', !hidden(doc.querySelector('.PKQ95p')), text(doc.querySelector('.PKQ95p')).slice(0, 50));
  check('post: post-footer itself not hidden', !hidden(doc.querySelector('footer[data-hook="post-footer"]')));
  check('post: post body untouched', !hidden(doc.querySelector('.post-content')) && text(doc.querySelector('.post-content')).includes('Body paragraph one'));
  check('post: site footer not hidden', !hidden(doc.querySelector('#bw-site-footer-restore')));
  check(
    'post: site-footer privacy button not treated as comments',
    !hidden(doc.querySelector('.bw-footer-bottom-links')),
  );
  dom.window.close();
}

// ---------------------------------------------------------------- scenario 2
// Post page where the site footer mounts late (long page). Nothing must be
// injected into the article in the meantime.
{
  const dom = await boot(postPageHtml({ withSiteFooter: false }), 'https://www.berlinwalk.com/post/telling-time-in-german-berlin');
  const doc = dom.window.document;
  check('late-footer post: no stray privacy button anywhere in article', doc.querySelectorAll('.bw-privacy-settings-link').length === 0,
    `${doc.querySelectorAll('.bw-privacy-settings-link').length} found`);
  check('late-footer post: comments still hidden', hidden(doc.querySelector('.wix-comments-wrapper')));

  // now mount the site footer and fire a scroll, as a real visitor would
  doc.body.insertAdjacentHTML('beforeend', SITE_FOOTER);
  doc.querySelector('#bw-site-footer-restore .bw-footer-bottom-links button').remove(); // simulate restore variant without its own control
  dom.window.dispatchEvent(new dom.window.Event('scroll'));
  await new Promise((r) => setTimeout(r, 900));
  const added = doc.querySelector('.bw-footer-bottom-links .bw-privacy-settings-link');
  check('late-footer post: control added to site footer after scroll', !!added, added ? 'ok' : 'missing');
  check('late-footer post: still nothing inside post-footer', !doc.querySelector('footer[data-hook="post-footer"] .bw-privacy-settings-link'));
  dom.window.close();
}

// ---------------------------------------------------------------- scenario 3
// /blog index: the CTA band is a <footer>, and the site footer mounts late.
{
  const dom = await boot(blogIndexHtml(), 'https://www.berlinwalk.com/blog');
  const doc = dom.window.document;
  check('blog index: no privacy button in the CTA band', !doc.querySelector('.bw-footer-band .bw-privacy-settings-link'));
  check('blog index: no stray privacy button at all', doc.querySelectorAll('.bw-privacy-settings-link').length === 0);

  doc.body.insertAdjacentHTML('beforeend', SITE_FOOTER);
  doc.querySelector('#bw-site-footer-restore .bw-footer-bottom-links button').remove();
  dom.window.dispatchEvent(new dom.window.Event('scroll'));
  await new Promise((r) => setTimeout(r, 900));
  check('blog index: control lands in site footer once mounted', !!doc.querySelector('.bw-footer-bottom-links .bw-privacy-settings-link'));
  check('blog index: CTA band still clean', !doc.querySelector('.bw-footer-band .bw-privacy-settings-link'));
  dom.window.close();
}

// ---------------------------------------------------------------- scenario 4
// A post that already has real reader comments must NOT be hidden silently.
{
  const withRealComments = postPageHtml().replace(
    '<p>Commenting on this post isn\'t available anymore. Contact the site owner for more info.</p>',
    '<div class="c"><span>Anna</span><p>Great guide, the Hackesche Höfe tip saved our afternoon.</p></div>',
  );
  const dom = await boot(withRealComments, 'https://www.berlinwalk.com/post/berlin-courtyards-hoefe');
  const doc = dom.window.document;
  const wrapper = doc.querySelector('.wix-comments-wrapper');
  check('real comments: only the bare "Comments" heading block may hide, not the thread',
    !hidden(wrapper), wrapper ? 'wrapper visible' : 'missing');
  check('real comments: reader comment text still present',
    text(doc.querySelector('.wix-comments-wrapper')).includes('Great guide'));
  dom.window.close();
}

// ---------------------------------------------------------------- scenario 5
// Late-mounting comments module (Wix lazy hydration) gets caught on scroll.
{
  const dom = await boot(postPageHtml({ withComments: false }), 'https://www.berlinwalk.com/post/is-berlin-safe-to-visit-an-honest-2026-guide');
  const doc = dom.window.document;
  check('lazy comments: nothing hidden before the module exists', doc.querySelectorAll('[data-bw-native-blog-end-hidden]').length === 0);
  doc.querySelector('footer[data-hook="post-footer"]').insertAdjacentHTML('beforeend', `
    <div class="wix-comments-wrapper">
      <div class="comments-head"><h2>Comments</h2></div>
      <div class="comments-empty-box"><p>Commenting on this post isn't available anymore. Contact the site owner for more info.</p></div>
    </div>`);
  dom.window.dispatchEvent(new dom.window.Event('scroll'));
  await new Promise((r) => setTimeout(r, 900));
  check('lazy comments: hidden after scroll pass', hidden(doc.querySelector('.wix-comments-wrapper')));
  check('lazy comments: tags row untouched', !hidden(doc.querySelector('.PKQ95p')));
  dom.window.close();
}

// ---------------------------------------------------------------- scenario 6
// Regression guard: the untouched paths (Related Posts + native share block
// outside the post footer) must still be hidden exactly as before.
{
  const html = postPageHtml().replace(
    '</div>\n    </div>',
    `</div>
      <section class="related-posts-section">
        <h2>Related Posts</h2>
        <a href="/post/a"><img src="a.jpg" alt="a">Post A</a>
        <a href="/post/b"><img src="b.jpg" alt="b">Post B</a>
      </section>
      <div class="legacy-share-row">
        <a href="#" aria-label="Share via Facebook">f</a>
        <a href="#" aria-label="Share via X (Twitter)">X</a>
        <a href="#" aria-label="Copy link to post">copy link</a>
      </div>
    </div>`,
  );
  const dom = await boot(html, 'https://www.berlinwalk.com/post/berlin-courtyards-hoefe');
  const doc = dom.window.document;
  const related = doc.querySelector('.related-posts-section');
  check('regression: Related Posts still hidden', hidden(related) || hidden(related?.parentElement),
    related ? (hidden(related) ? 'section hidden' : 'parent hidden') : 'missing');
  // Native share hiding depends on getBoundingClientRect geometry, which jsdom
  // always reports as 0, so it cannot be asserted here. The share code path is
  // byte-identical to the live pinned build (verified by diff).
  check('regression: our own share bar not hidden', !doc.querySelector('[data-bw-blog-share-bar][data-bw-native-blog-end-hidden]'));
  dom.window.close();
}

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
