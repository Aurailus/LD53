import { h } from 'preact';
import { useCallback, useMemo, useState } from 'preact/hooks';

import Companies, { Company } from './company/Company';
import { getName } from './customer/Customer';

import background from '@res/room/background.png';
import conveyor from '@res/room/conveyor.png';
import toolbox_back from '@res/room/toolbox_back.png';

import { Info } from './Info';
import { ActiveProblems, Product, ProductContext, Tool } from './product/Product';

import Plushie from './product/Plushie';
import Cartridge from './product/Cartridge';
import Headset from './product/Headset';
import { Checklist } from './Checklist';
import { merge } from './Util';

export function Game() {
	const [ product, setProduct ] = useState<Product>(Plushie);
	const [ problems, setActiveProblems ] = useState<ActiveProblems>(
		product.problems.map(p => ({ identifier: p.identifier, found: false })));
	const [ tool, setTool ] = useState<Tool>({ type: 'hand' });
	const [ company, setCompany ] = useState<Company>(Companies[Math.floor(Math.random() * Companies.length)]);
	const [ customer, setCustomer ] = useState(getName());

	const onProblem = useCallback((identifier: string) => {
		setActiveProblems((problems) => {
			const newProblems = JSON.parse(JSON.stringify(problems)) as ActiveProblems;
			const prob = newProblems.find(p => p.identifier === identifier);
			if (prob) {
				prob.found = true;
				setTool({ type: 'hand' });
			}
			return newProblems;
		});
	}, []);

	const handleSelectProblem = useCallback((identifier: string) => {
		console.log('selet ples', identifier);
		setTool((current: Tool) => {
			if (current.type === 'test' && current.problem === identifier) {
				return { type: 'hand' };
			}
			else {
				return { type: 'test', problem: identifier };
			}
		});
	}, []);

	const ctx = useMemo(() => ({
		product,
		problems,
		tool,
		setTool,
		onProblem
	}), [ product, problems, tool, onProblem, setTool ]);

	const ProductComponent = product.component;

	// return <h1 class='bg-red-500'>Hi there :)</h1>
	return (
		<ProductContext.Provider value={ctx}>
			<div class='w-screen h-screen bg-black overflow-hidden flex flex-col'>
				{/* Header */}
				<div class='w-screen h-16 shrink-0 bg-gray-700'>

				</div>

				{/* Main Area */}
				<div class='w-screen h-auto flex-grow overflow-hidden grid bg-[size:1920px,1080px]'
					style={{ backgroundImage: `url(${background})`, backgroundPosition: 'bottom left', gridTemplateColumns: '1fr min(33vw, 496px)' }}>

					<div class='absolute left-0 right-0 h-72 bg-contain interact-none max-w-none max-h-none w-full bottom-0'
						style={{ backgroundImage: `url(${conveyor})` }}/>

					{/* Left (Game) Area */}
					<div class='relative'>
						<div class='block text-green-300 font-computer w-[28rem] h-[17rem] p-3 pt-2 pb-0
							absolute bottom-[30rem] left-20 z-0 flex flex-col font-bold antialiased'>
							<div class='flex justify-between border-b-2 border-green-300 mb-2'>
								<p>Order #{Math.floor(Math.random() * 1000)}</p>
								<p>Purchased 23/10/2023</p>
							</div>

							<div class='flex justify-start gap-2 items-center mb-2'>
								<div class='w-7 h-7 bg-green-400 rounded-full'/>
								<p>{customer}</p>
							</div>

							<div class='flex justify-start max-w-full overflow-hidden gap-2 mb-2'>
								<div class='w-20 h-20 bg-green-400 rounded shrink-0'/>

								<div class='flex flex-col gap-3 max-w-full overflow-hidden'>
									<p class='overflow-hidden line-clamp-2'>{product.name}</p>

									<div class='flex gap-3 items-center'>
										<p class='text-sm'>{company.name}</p>

										<div class='flex gap-2'>
											<div class={merge('w-4 h-4 rounded-full',
												company.rating >= 1 ? 'bg-green-500' : company.rating >= 0.5
													? 'bg-green-700' : 'bg-green-900')}></div>
											<div class={merge('w-4 h-4 rounded-full',
												company.rating >= 2 ? 'bg-green-500' : company.rating >= 1.5
													? 'bg-green-700' : 'bg-green-900')}></div>
											<div class={merge('w-4 h-4 rounded-full',
												company.rating >= 3 ? 'bg-green-500' : company.rating >= 2.5
													? 'bg-green-700' : 'bg-green-900')}></div>
											<div class={merge('w-4 h-4 rounded-full',
												company.rating >= 4 ? 'bg-green-500' : company.rating >= 3.5
													? 'bg-green-700' : 'bg-green-900')}></div>
											<div class={merge('w-4 h-4 rounded-full',
												company.rating >= 5 ? 'bg-green-500' : company.rating >= 4.5
													? 'bg-green-700' : 'bg-green-900')}></div>
										</div>
									</div>

								</div>

							</div>

							<p class='border-b-2 border-green-300 mb-2'>Reviews</p>
							<p class='text-sm line-clamp-3'>{product.reviews[Math.floor(Math.random() * product.reviews.length)]}</p>
						</div>

						<div class='overflow-auto w-auto h-auto absolute left-1/2 -translate-x-1/2'
							style={{ bottom: `${64 + (product.yOffset ?? 0) * 4}px` }}>
							<ProductComponent/>
						</div>

					</div>

					{/* Right (Info) Area */}
					<div class='relative grid overflow-hidden max-h-full'>
						<Info>
							<Checklist onSelectProblem={handleSelectProblem}/>
						</Info>
					</div>

				</div>
			</div>
		</ProductContext.Provider>
	);
}
