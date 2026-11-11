"""Regenerate the profile artwork: pip install Pillow imageio-ffmpeg.

Run from any directory with `python docs/profile/generate.py`.
Project clips come from the portfolio's original films, not remote services.
"""

import math
import os
from pathlib import Path
import subprocess
from concurrent.futures import ThreadPoolExecutor

import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / "docs/profile"
ASSETS.mkdir(exist_ok=True)
FONT = os.environ.get("PROFILE_FONT", "/System/Library/Fonts/Supplemental/Arial.ttf")
BOLD = os.environ.get("PROFILE_BOLD_FONT", "/System/Library/Fonts/Supplemental/Arial Bold.ttf")
MONO = os.environ.get("PROFILE_MONO_FONT", "/System/Library/Fonts/Supplemental/Andale Mono.ttf")


def hero(dark=True):
    width, height = 1200, 400
    ink, muted, blue = ("#ffffff", "#aab1bb", "#5875ff") if dark else ("#242522", "#777971", "#3454df")
    suffix = "" if dark else "-light"
    frames = []
    # A rotating, dotted torus: one continuous revolution, with no end-frame pause.
    for frame in range(64):
        phase = frame / 64 * math.tau
        im = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        d.text((42, 31), "MATTHIEU DUCHATELLIER", font=ImageFont.truetype(MONO, 15), fill=ink)
        d.text((42, 88), "I love building", font=ImageFont.truetype(BOLD, 62), fill=ink)
        d.text((39, 157), "AI products.", font=ImageFont.truetype(BOLD, 78), fill=ink)
        d.text((44, 262), "Product Manager  /  Design Engineer", font=ImageFont.truetype(FONT, 23), fill=muted)
        label = "PRODUCT THINKING.  DESIGN CRAFT.  CODE."
        label_font = ImageFont.truetype(MONO, 13)
        label_bounds = d.textbbox((0, 0), label, font=label_font)
        label_y = 351 - (label_bounds[1] + label_bounds[3]) / 2
        d.ellipse((44, 347, 52, 355), fill=blue)
        d.text((66, label_y), label, font=label_font, fill=muted)
        domain_font = ImageFont.truetype(MONO, 14)
        domain_bounds = d.textbbox((0, 0), "matthieu.pm", font=domain_font)
        domain_y = 351 - (domain_bounds[1] + domain_bounds[3]) / 2
        d.text((1030, domain_y), "matthieu.pm", font=domain_font, fill=ink)
        points=[]
        for u in range(68):
            a = u / 68 * math.tau
            for v in range(22):
                b = v / 22 * math.tau
                # Twist the surface very gently as it turns.
                r = 107 + 4 * math.sin(3*a + phase)
                x=(r+43*math.cos(b))*math.cos(a)
                y=(r+43*math.cos(b))*math.sin(a)
                z=43*math.sin(b)
                x,z=x*math.cos(phase)-z*math.sin(phase),x*math.sin(phase)+z*math.cos(phase)
                tilt=.93
                y,z=y*math.cos(tilt)-z*math.sin(tilt),y*math.sin(tilt)+z*math.cos(tilt)
                s=550/(550-z)
                points.append((z, 925+x*s, 167+y*s, s))
        for z,x,y,s in sorted(points):
            depth=(z+160)/320
            far, near = ((110,128,205),(102,134,255)) if dark else ((181,190,219),(42,68,183))
            color=tuple(int(a+(b-a)*depth) for a,b in zip(far,near))
            size=1.1+max(0,depth)*1.3
            d.ellipse((x-size,y-size,x+size,y+size),fill=color)
        if frame == 0:
            im.save(ASSETS/f"hello{suffix}.png")
        # Reserve index zero for transparency in every frame. Disposal=2 clears
        # the previous sculpture before drawing its next pose on the page.
        quantized = im.convert("RGB").quantize(colors=95, method=Image.Quantize.MEDIANCUT)
        palette = [0, 0, 0] + quantized.getpalette()[:765]
        quantized = quantized.point(lambda index: index + 1)
        quantized.putpalette(palette)
        transparent = im.getchannel("A").point(lambda alpha: 255 if alpha < 128 else 0)
        quantized.paste(0, mask=transparent)
        frames.append(quantized)
    frames[0].save(ASSETS/f"hello{suffix}.gif",save_all=True,append_images=frames[1:],duration=80,loop=0,optimize=False,disposal=2,transparency=0,background=0)


def clip(name):
    # Fit a useful portion of each film into a compact, independently hosted GIF.
    start, duration, speed = {"carbon": (1, 18, 2), "forge": (5, 16, 2), "atrium": (5, 16, 2), "inspirations": (0, 11, 1.5)}[name]
    filters=f"[0:v]trim=start={start}:duration={duration},setpts=(PTS-STARTPTS)/{speed},fps=8,scale=560:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle"
    subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),"-y","-i",str(ROOT/f"apps/web/public/videos/{name}.mp4"),"-filter_complex",filters,"-loop","0",str(ASSETS/f"{name}.gif")],check=True,capture_output=True)


if __name__ == "__main__":
    hero()
    hero(dark=False)
    with ThreadPoolExecutor(max_workers=4) as pool:
        list(pool.map(clip,["carbon","forge","atrium","inspirations"]))
    for path in sorted(ASSETS.glob("*.gif")):
        print(f"{path.name}: {path.stat().st_size / 1024:.0f} KB")
