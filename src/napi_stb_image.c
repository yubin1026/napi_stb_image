#include <node_api.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"

#define NAPI_DEFINE_CONSTANT(target, constant)                           \
  do {                                                                   \
    napi_value v = NULL;                                                 \
    napi_create_int32(env, constant, &v);                                \
    napi_set_named_property(env, target, #constant, v);                  \
  }                                                                      \
  while (0)


#define NAPI_SET_METHOD(target, name, callback)                         \
  do {                                                                  \
    napi_value fn = NULL;                                               \
    napi_create_function(env, NULL, 0, callback, NULL, &fn);            \
    napi_set_named_property(env, target, name, fn);                     \
  }                                                                     \
  while (0)

napi_value stbi_load_from_memory_Callback(napi_env env, napi_callback_info info)
{
    size_t argc = 1;
    napi_value argv[1];
    napi_get_cb_info(env, info, &argc, argv, NULL, NULL);

    uint8_t* buf;
    size_t len;
    napi_get_buffer_info(env, argv[0], (void**) &buf, &len);

    int width, height, channels;

    stbi_uc* uc = stbi_load_from_memory(buf, len, &width, &height, &channels, 4);
    
    napi_value obj;
    napi_create_object(env, &obj);
   
    napi_value v;    

    int buflen = width * height * 4;

    stbi_uc* resbuf;

    napi_create_buffer_copy(env, buflen, uc, (void**) &resbuf, &v);
    napi_set_named_property(env, obj, "buffer", v);   

    napi_create_int32(env, width, &v);
    napi_set_named_property(env, obj, "width", v);     

    napi_create_int32(env, height, &v);
    napi_set_named_property(env, obj, "height", v); 

    return obj;
}

napi_value Init(napi_env env, napi_value exports) {

  NAPI_SET_METHOD(exports, "stbi_load_from_memory", stbi_load_from_memory_Callback);

  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)