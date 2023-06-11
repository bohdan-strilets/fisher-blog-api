import { PostBodyType } from '../types/post-body.type';

const countWords = (text: string): number => {
  const words = text.trim().split(/\s+/);
  return words.length;
};

const calculateSum = (numbers: number[]): number => {
  const sum = numbers.reduce((acc, cur) => acc + cur, 0);
  return sum;
};

const calculateListLength = (listItems: PostBodyType[]) => {
  const titlesLength = calculateSum(listItems.map(item => countWords(item.content)));
  const items = listItems.map(item =>
    calculateSum(item.listItems.map(string => countWords(string))),
  );
  const itemsLength = calculateSum(items);
  return titlesLength + itemsLength;
};

const calculateReadingTime = (wordCount: number): number => {
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes * 60;
};

const averageReadingTime = (postBody: PostBodyType[]): number => {
  let quantityWords = 0;
  const averageImageViewingTime = 10;

  const titles = postBody.filter(item => item.type === 'title');
  const paragraphs = postBody.filter(item => item.type === 'paragraph');
  const images = postBody.filter(item => item.type === 'image');
  const videos = postBody.filter(item => item.type === 'video');
  const lists = postBody.filter(item => item.type === 'list');
  const links = postBody.filter(item => item.type === 'link');
  const comments = postBody.filter(item => item.type === 'comment');

  const titlesLength = calculateSum(titles.map(item => countWords(item.content)));
  const paragrapshLength = calculateSum(paragraphs.map(item => countWords(item.content)));
  const linksLength = calculateSum(links.map(item => countWords(item.content)));
  const commentsLength = calculateSum(comments.map(item => countWords(item.content)));
  const imagesLength = images.length * averageImageViewingTime;
  const listsLength = calculateListLength(lists);
  const videosLength = videos.reduce((acc, cur) => acc + cur.videoSize, 0);

  quantityWords = titlesLength + paragrapshLength + linksLength + commentsLength + listsLength;
  const result = calculateReadingTime(quantityWords);
  return result + imagesLength + videosLength;
};

export default averageReadingTime;
