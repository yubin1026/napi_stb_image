{
	'targets': [
	{
		'target_name': 'napi_stb_image',
		'sources': [
			'src/napi_stb_image.c',
		],
		'conditions': [[
			'OS=="mac"', {
				'libraries': [
					
				],
				'xcode_settings': {
            		'OTHER_LDFLAGS': [
              			'-undefined dynamic_lookup',
              			'-framework Cocoa',
              			'-framework OpenGL',              			
              			'-framework OpenAL',
            		]
          		},
				'include_dirs': [
					'/usr/local/include'
				]
			}
		]],
		'defines': [
			'_THREAD_SAFE',
			'ENABLE_ARG_CHECKING',
		]
	}
	]
}
