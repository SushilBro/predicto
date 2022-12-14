import { CountdownCircleTimer } from
	'react-countdown-circle-timer'

export default function Time(){
return (
	<div>
	<CountdownCircleTimer
		isPlaying
		duration={300}
		colors={[
		['#004777', 0.33],
		['#F7B801', 0.33],
		['#A30000', 0.33],
		]}
	>
		{({ remainingTime }) => remainingTime}
	</CountdownCircleTimer>
	</div>
	
)
}
