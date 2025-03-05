import { useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { ComboboxControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const { postID } = attributes;
	const [selectedPost, setSelectedPost] = useState(postID);
	const [searchTerm, setSearchTerm] = useState('');
	const [options, setOptions] = useState([]);

	// Fetch posts based on the search term using useSelect hook
	const posts = useSelect(select => {
		return select('core').getEntityRecords('postType', 'item', { search: searchTerm, per_page: 10 });
	}, [searchTerm]);

	// Update the options state when posts are fetched
	useEffect(() => {
		if (posts) {
			setOptions(posts.map(post => ({ label: post.title.rendered, value: post.id })));
		}
	}, [posts]);

	// Fetch the selected post when postID changes
	const selectedPostData = useSelect(select => {
		return postID ? select('core').getEntityRecord('postType', 'item', postID, { _embed: true }) : null;
	}, [postID]);

	// Use optional chaining (?.) to prevent errors if data is missing
	const postTitle = selectedPostData?.title?.rendered || '';
	const postExcerpt = selectedPostData?.excerpt?.rendered || '';
	const postImage = selectedPostData?._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? '';

	return (
		<div {...useBlockProps()}>
			<div className="product-callout">
				<div class="product-callout__controls">
					<ComboboxControl
						label="Search and Select an Item" // Label for the ComboboxControl
						value={selectedPost} // Value of the selected post
						options={options} // Options for the ComboboxControl
						onInputChange={(value) => setSearchTerm(value)} // Update search term when input changes
						onChange={(value) => {
							setSelectedPost(value); // Update selected post ID
							setAttributes({ postID: parseInt(value) }); // Update the postID attribute
						}}
					/>
				</div>
				{selectedPostData && (
					<div class="product-callout__content">
						<div class="image">
							{postImage && <img src={postImage} alt={postTitle} />}
						</div>
						<div class="text">
							<h2>{postTitle}</h2>
							{postExcerpt && <p dangerouslySetInnerHTML={{ __html: postExcerpt }} />}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
