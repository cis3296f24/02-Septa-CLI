import { render } from '@testing-library/svelte';
import Map from '../components/Map.svelte';
import TripPlanner from '../components/TripPlanner.svelte';
import Marquee from '../components/Marquee.svelte';
import Home from '../components/Home.svelte';
import TimeTable from '../components/TimeTable.svelte';

test('Map component renders with props', () => {
  const { container } = render(Map, {
    props: { latitude: 37.7749, longitude: -122.4194 },
  });
  expect(container.childElementCount).toBeGreaterThan(0); 
});

test('TripPlanner component renders', () => {
  const { container } = render(TripPlanner);
  expect(container.childElementCount).toBeGreaterThan(0);
});

test('Marquee component renders', () => {
  const { container } = render(Marquee);
  expect(container.childElementCount).toBeGreaterThan(0); 
});

test('Home component renders', () => {
  const { container } = render(Home);
  expect(container.childElementCount).toBeGreaterThan(0); 
});

test('TimeTable component renders', () => {
  const { container } = render(TimeTable);
  expect(container.childElementCount).toBeGreaterThan(0); 
});