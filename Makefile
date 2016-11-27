build_dir = /usr/local/shuttle-build
rel_type = patch
hyper_ip = 209.177.87.250

copy:
	cp ./src/index.html dist/
	cp ./src/images/* dist/
	cp node_modules/quill/dist/quill.core.css dist/
	cp node_modules/quill/dist/quill.snow.css dist/

clean:
	rm -rf $(build_dir)
	mkdir $(build_dir)

get-sources: clean
	git clone https://github.com/scottmtp/shuttle.git $(build_dir)

prep-src-dir: get-sources
	mkdir -p $(build_dir)/dist
	cp -R ../shuttle-prod $(build_dir)/data

build: prep-src-dir
	pushd $(build_dir); \
	npm install; \
	npm test; \
	popd

incr-version: prep-src-dir
	pushd $(build_dir); \
	npm version $(rel_type) -m "Releasing new shuttle version."; \
	node -p -e "require('./package.json').version" > version; \
	git rev-parse master >> version; \
	git add version; git commit -m "Shuttle release."; git push; \
	popd

docker-release-build: incr-version
	pushd $(build_dir); \
	docker build -t shuttle .; \
	docker tag shuttle 757482163036.dkr.ecr.us-east-1.amazonaws.com/shuttle; \
	docker push 757482163036.dkr.ecr.us-east-1.amazonaws.com/shuttle; \
	hyper pull 757482163036.dkr.ecr.us-east-1.amazonaws.com/shuttle; \
	popd

docker-deploy: docker-release-build
	pushd $(build_dir); \
	hyper rm shuttle3; \
	hyper rename shuttle2 shuttle3; \
	hyper rename shuttle1 shuttle2; \
	hyper run --size s3 -d -p 80 -p 443 --name shuttle1 757482163036.dkr.ecr.us-east-1.amazonaws.com/shuttle; \
	hyper fip detach shuttle2; \
	hyper fip attach $(hyper_ip) shuttle1; \
	hyper stop shuttle2; \
	popd

