<?php
function render_dynamic_product_callout_block($attributes) {
  $post_id = isset($attributes['postID']) ? intval($attributes['postID']) : null;
  
  if (!$post_id) return;

  // Get post data
  $post = get_post($post_id);
  if (!$post)  return;

  $title = esc_html(get_the_title($post_id));
  $excerpt = esc_html(get_the_excerpt($post_id));
  $image = get_the_post_thumbnail_url($post_id, 'medium');
  
  $links = get_field('links', $post_id);

  // $content = get_the_content(null, false, $post_id);

  ob_start(); ?>

  <div class="product-callout">
    <div class="product-callout__content">
      <div class="image">
        <img src="<?php echo $image; ?>" alt="<?php echo $title; ?>" />
      </div>
      <div class="text">
        <h2 class="title"><?php echo $title; ?></h2>
        <p class="excerpt"><?php echo $excerpt; ?></p>
        <a href="#">Buy on Amazon</a>

        <!-- <?php if ($links): ?>
          <div class="links">
            <?php foreach ($links as $link): ?>
              <a href="<?php echo esc_url($link['url']); ?>" target="_blank"><?php echo esc_html($link['title']); ?></a>
            <?php endforeach; ?>
          </div>
        <?php endif; ?> -->

      </div><!-- .text --> 
    </div><!-- .product-callout__content -->
  </div><!-- .product-callout -->
    
  <?php return ob_get_clean();
};