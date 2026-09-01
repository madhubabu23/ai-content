const industryData = {
  'real-estate': { label: 'real estate', title: 'Real Estate', audience: 'home seekers and future-focused investors', pillars: ['location', 'amenities', 'lifestyle', 'investment', 'property USP', 'configuration', 'architecture'], hooks: ['The address that makes every morning feel more considered.', 'More than a floor plan. A future with room to grow.', 'When the right location changes the way you live.'], visuals: ['Golden-hour exterior with the surrounding neighbourhood in frame.', 'A clean, editorial floor-plan detail beside warm lifestyle photography.', 'A family using the shared amenities, candid and sunlit.'], tags: ['#RealEstateIndia', '#PropertyInvestment', '#DreamHome', '#NewHome'] },
  jewellery: { label: 'jewellery', title: 'Jewellery', audience: 'style-conscious occasion shoppers and collectors', pillars: ['craftsmanship', 'luxury', 'occasion', 'design', 'materials', 'emotion', 'gifting'], hooks: ['Made for the moments that deserve a little more light.', 'Some stories are best told in gold.', 'The detail you notice first is never the whole story.'], visuals: ['Macro shot of the setting and stone against a softly textured backdrop.', 'A styled occasion look with the hero piece catching natural light.', 'Artisan hands working on a finishing detail in the studio.'], tags: ['#FineJewellery', '#JewelleryDesign', '#MadeToTreasure', '#ModernLuxury'] },
  perfume: { label: 'perfume', title: 'Product · Perfume', audience: 'sensory shoppers who use fragrance as self-expression', pillars: ['fragrance notes', 'mood', 'personality', 'lifestyle', 'luxury', 'occasion', 'sensory language'], hooks: ['A little citrus. A warm trail. A mood all your own.', 'Wear the version of you that arrives before you do.', 'Not just a fragrance. The atmosphere you leave behind.'], visuals: ['Bottle on a sculptural surface with ingredients from the top notes nearby.', 'A tactile morning ritual with the fragrance as the quiet focal point.', 'Moody dusk portrait with a subtle visual cue to the scent family.'], tags: ['#FragranceLovers', '#ScentOfTheDay', '#PerfumeCollection', '#ScentStory'] },
  food: { label: 'FMCG food', title: 'FMCG · Food', audience: 'busy households looking for everyday deliciousness', pillars: ['taste', 'ingredients', 'convenience', 'family', 'consumption occasions', 'product benefits', 'food appeal'], hooks: ['Good food has a way of making ordinary moments gather round.', 'Big flavour, ready for the life you actually live.', 'The easiest part of dinner should be the part everyone loves.'], visuals: ['Bright overhead spread showing the product in a real mealtime moment.', 'Ingredient-led close-up with vivid texture and a hand reaching in.', 'Warm family table scene with generous, shareable food in focus.'], tags: ['#GoodFoodEveryDay', '#FoodieFinds', '#MadeForSharing', '#QuickAndDelicious'] }
};

let selectedIndustry = 'real-estate';
let selectedDuration = 'week';
let selectedPosts = 3;
let uploadedFiles = [];
const $ = (selector) => document.querySelector(selector);

function chooseIndustry(button) {
  document.querySelectorAll('.industry-option').forEach((item) => item.classList.remove('selected'));
  button.classList.add('selected');
  selectedIndustry = button.dataset.industry;
  $('#tone-industry').textContent = industryData[selectedIndustry].label;
}

document.querySelectorAll('.industry-option').forEach((button) => button.addEventListener('click', () => chooseIndustry(button)));
document.querySelectorAll('.duration-option').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.duration-option').forEach((item) => item.classList.remove('selected'));
  button.classList.add('selected');
  selectedDuration = button.dataset.duration;
  selectedPosts = Number(button.dataset.posts);
}));

$('#file-upload').addEventListener('change', (event) => {
  uploadedFiles = [...uploadedFiles, ...[...event.target.files].map((file) => file.name)];
  renderFiles();
});
function renderFiles() {
  $('#file-list').innerHTML = uploadedFiles.map((file, index) => `<span class="file-chip">${file} <button aria-label="Remove ${file}" data-index="${index}">×</button></span>`).join('');
  document.querySelectorAll('.file-chip button').forEach((button) => button.addEventListener('click', () => { uploadedFiles.splice(Number(button.dataset.index), 1); renderFiles(); }));
}

function getDate(index) {
  const date = new Date();
  date.setDate(date.getDate() + (index * 3) + 1);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
function createPosts() {
  const data = industryData[selectedIndustry];
  const seed = uploadedFiles.length ? ` Inspired by your ${uploadedFiles[0]} reference.` : '';
  return Array.from({ length: selectedPosts }, (_, index) => {
    const pillar = data.pillars[index % data.pillars.length];
    const hook = data.hooks[index % data.hooks.length];
    const caption = `${hook}\n\nDiscover the ${pillar} behind a choice made to fit beautifully into real life. Save this for your next ${data.label === 'real estate' ? 'move' : 'moment'}.${seed}`;
    return { number: String(index + 1).padStart(2, '0'), date: getDate(index), pillar, caption, visual: data.visuals[index % data.visuals.length], tags: `${data.tags[index % data.tags.length]} ${data.tags[(index + 1) % data.tags.length]} #${pillar.replace(/\s/g, '')}` };
  });
}
function renderPosts() {
  const data = industryData[selectedIndustry];
  const posts = createPosts();
  $('#results-title').textContent = `${data.title} · ${selectedDuration === 'week' ? '1 week' : selectedDuration === 'fortnight' ? '2 weeks' : '1 month'} of ideas.`;
  $('#empty-results').style.display = 'none';
  $('#copy-button').disabled = false;
  $('#export-button').disabled = false;
  $('#post-list').innerHTML = posts.map((post) => `<article class="post-card"><div><div class="post-number">${post.number}</div><div class="post-meta">${post.date}</div></div><div class="post-body"><h3>${post.pillar}</h3><p>${post.caption.replace(/\n\n/g, '<br><br>')}</p></div><div class="post-side"><label>Image caption / visual direction</label><p>${post.visual}</p><p class="hashtags">${post.tags}</p></div></article>`).join('');
  $('#results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
$('#generate-button').addEventListener('click', () => {
  const button = $('#generate-button');
  button.disabled = true;
  button.querySelector('span:first-child').textContent = 'Writing your plan...';
  window.setTimeout(() => { renderPosts(); button.disabled = false; button.querySelector('span:first-child').textContent = 'Regenerate content plan'; }, 450);
});
$('#copy-button').addEventListener('click', async () => {
  const text = [...document.querySelectorAll('.post-card')].map((post) => post.innerText).join('\n\n');
  await navigator.clipboard.writeText(text);
  $('#copy-button').textContent = '✓ Copied';
  window.setTimeout(() => { $('#copy-button').textContent = '▣ Copy all'; }, 1500);
});
$('#export-button').addEventListener('click', () => {
  const text = `${industryData[selectedIndustry].title} CONTENT PLAN\n\n${[...document.querySelectorAll('.post-card')].map((post) => post.innerText).join('\n\n')}`;
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
  link.download = `${selectedIndustry}-content-plan.txt`;
  link.click();
  URL.revokeObjectURL(link.href);
});
