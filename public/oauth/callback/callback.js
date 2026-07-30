const values = location.hash ? location.hash.slice(1) : location.search.slice(1);

if (values) {
  location.replace(`clipzy://oauth/callback?${values}`);
}
