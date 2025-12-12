module.exports = function(eleventyConfig) {
  // Pass through assets
  eleventyConfig.addPassthroughCopy("src/assets");

  // Watch CSS files for changes
  eleventyConfig.addWatchTarget("src/assets/css/");

  // Add package.json version to global data for cache busting
  eleventyConfig.addGlobalData("pkg", require("./package.json"));

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    serverOptions: {
      port: 8000
    }
  };
};
