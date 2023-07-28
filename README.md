<p align="center">
    <img align=center src="https://stardew.me/assets/logo.png" alt="Stardew.me Logo" width="100" /></br>
</p>

<p align="center">
    <strong>stardew.me</strong></br>
    <i>Highly efficient Stardew Valley 1.5 player sprite renderer API, built in Python</i>
</p>

# Overview

Stardew.me is a full-stack application (and RESTful API) that, upon being given a body of data from a Stardew Valley save file, will generate a 128x256 PNG file of the player. As it currently stands, stardew.me is the only player renderer capable of processing a version 1.5 Stardew Valley save.

## How to use the API
TBD.

## Technical breakdown
This Git repository is split into two different parts:
- `backend/`: contains all the backend Python code
- `frontend/` contains all the frontend Next.js code

### Backend: Python

Under the hood, the player renderer uses Python, as well as Python Image Library and Pillow to generate player sprites. We do this with a combination of a few things:
- [Stardew Valley's player spritesheets](https://stardewvalley.net)
- [Stardew Valley's background assets](https://stardewvalley.net)
- [upload.farm's crop_image function (which was incredibly useful)](https://github.com/Sketchy502/SDV-Summary/blob/4f116374650998ddad7aa48713e2619df565e3b9/sdv/getSprite.py)
- Lots of love

The renderer searches out for all of the assets, combines them into an image, upscales it, and uploads it into a Cloudflare R2 bucket for storage. Once uploaded, the API returns a Cloudflare R2 object URL that returns the image.

### Frontend: Next.js
The frontend is composed of a stack of [Next.js](https://nextjs.org), [shadcn's UI kit](https://ui.shadcn.com), and [TailwindCSS](https://tailwindcss.com).

## Contributing guidelines
TBD

## Self-hosting
TBD
