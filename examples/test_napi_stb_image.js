'use strict';

const util = require("util");
const fs = require('fs');

const SDL2 = require('napi_sdl2');
const VG = require('napi_openvg');
const STB_Image = require('napi_stb_image');

let context = {
	window : null
}

function clear_box(x, y, w, h)
{
    // clear screen
    let clearColor = [1,1,1,1];
    VG.vgSetfv(VG.VG_CLEAR_COLOR, 4, clearColor);
    VG.vgClear(x, y, w, h);
}

function create_image(path) {
    let stat = fs.statSync(path);

    let handle = fs.openSync(path, 'r');
    let buf = new Buffer(stat.size);
    let read = fs.readSync(handle, buf, 0, stat.size, null); 
    fs.closeSync(handle);


	let img = STB_Image.stbi_load_from_memory(buf);

    img.obj = VG.vgCreateImage( VG.VG_lABGR_8888, img.width, img.height, VG.VG_IMAGE_QUALITY_BETTER);
    VG.vgImageSubData(img.obj, img.buffer, img.width * 4,  VG.VG_lABGR_8888, 0, 0, img.width, img.height);
    return img;
}

function draw_image(img, x, y, ww, hh) {
    
    VG.vgSeti(VG.VG_MATRIX_MODE, VG.VG_MATRIX_IMAGE_USER_TO_SURFACE);
    VG.vgLoadIdentity();
    let wscale = ww / img.width;
    let hscale = hh / img.height;
    
    VG.vgTranslate(x,  y);
    VG.vgScale(wscale, hscale);
    
    VG.vgDrawImage(img.obj);
}

function render(ctx)
{
	let [screen_width, screen_height] = SDL2.SDL_GetWindowSize(ctx.window);

	clear_box(0, 0, screen_width, screen_height);
	let path = "./SMWU.jpeg";
	let img = create_image(path);
	draw_image(img, screen_width / 4, screen_height / 4, screen_width / 2, screen_height / 2);
	VG.vgDestroyImage(img.obj);
	img = null;

	VG.vgFlush();
	SDL2.SDL_GL_SwapWindow( ctx.window );
}

function main() {

	SDL2.SDL_Init(SDL2.SDL_INIT_EVERYTHING);
	SDL2.SDL_GL_SetAttribute(SDL2.SDL_GL_CONTEXT_FLAGS, SDL2.SDL_GL_CONTEXT_FORWARD_COMPATIBLE_FLAG);
	SDL2.SDL_GL_SetAttribute(SDL2.SDL_GL_DOUBLEBUFFER, 1);
	SDL2.SDL_GL_SetAttribute(SDL2.SDL_GL_MULTISAMPLEBUFFERS, 8);
	SDL2.SDL_GL_SetAttribute(SDL2.SDL_GL_MULTISAMPLESAMPLES, 8);
	SDL2.SDL_GL_SetAttribute(SDL2.SDL_GL_DEPTH_SIZE, 24);
	SDL2.SDL_GL_SetAttribute(SDL2.SDL_GL_STENCIL_SIZE, 8);
	SDL2.SDL_GL_SetAttribute(SDL2.SDL_GL_CONTEXT_MAJOR_VERSION, 2);
	SDL2.SDL_GL_SetAttribute(SDL2.SDL_GL_CONTEXT_MINOR_VERSION, 1);


	let [screen_width, screen_height] = [800, 800];
	let sdl_window = SDL2.SDL_CreateWindow("napi_stb_image Sample", 
		0, 0, screen_width, screen_height, SDL2.SDL_WINDOW_OPENGL | SDL2.SDL_WINDOW_SHOWN | SDL2.SDL_WINDOW_RESIZABLE);
	let sdl_context = SDL2.SDL_GL_CreateContext( sdl_window );
	SDL2.SDL_GL_SetSwapInterval(1);
   
	let quit = false;
	VG.vgCreateContextSH(screen_width, screen_height);

	context.window = sdl_window;
	render(context);
	
	let cursor = SDL2.SDL_CreateSystemCursor(SDL2.SDL_SYSTEM_CURSOR_ARROW);
	SDL2.SDL_SetCursor(cursor);
	SDL2.SDL_ShowCursor(1);
			
 	//SDL2.SDL_StartTextInput();
	while(!quit)
	{
		let event = {};
		SDL2.SDL_PumpEvents();
		while(1) {
			let ret = SDL2.SDL_PeepEvents(event, 1, SDL2.SDL_GETEVENT, SDL2.SDL_FIRSTEVENT, SDL2.SDL_LASTEVENT);
			if(ret == 1) break;
			SDL2.SDL_Delay(10);
			render(context);
			SDL2.SDL_PumpEvents();
		}

		switch(event.type)
		{
			case "MOUSEBUTTONDOWN":
				break;
			case "MOUSEBUTTONUP":
				break;
			case "MOUSEWHEEL":
				break;
			case "WINDOWEVENT":
				if(event.event == "WINDOWEVENT_RESIZED") {
					[screen_width, screen_height] = SDL2.SDL_GetWindowSize(context.window);
					VG.vgResizeSurfaceSH(screen_width, screen_height);
					render(context);
				} else if(event.event == "WINDOWEVENT_SIZE_CHANGED") {
		
				} else if(event.event == "WINDOWEVENT_EXPOSED") {
				}
				break;
			case "KEYDOWN":
				break;
			case "QUIT":
				quit = true;
				break;
		}
	}
	SDL2.SDL_DestroyWindow(context.window);
	VG.vgDestroyContextSH();
	SDL2.SDL_Quit();
}

main();
