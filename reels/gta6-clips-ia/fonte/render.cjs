const { chromium } = require('playwright'); const { spawn } = require('child_process');
(async () => {
  const [,, out, f0, f1, fps] = process.argv;
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + process.cwd() + '/index.html'); await p.evaluate(() => window.pronto);
  const ff = spawn('ffmpeg', ['-v','error','-y','-f','image2pipe','-framerate',fps,'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','medium','-crf','16','-pix_fmt','yuv420p','-r',fps,out], { stdio: ['pipe','inherit','inherit'] });
  for (let i = +f0; i < +f1; i++) {
    await p.evaluate(t => render(t), i / +fps);
    const buf = await p.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 300 === 0) console.log(out, i);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close();
  console.log(errs.length ? errs.join('\n') : 'ok ' + out);
})();
