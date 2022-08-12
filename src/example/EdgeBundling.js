import React, { useState, useRef } from 'react';
import { GoslingComponent } from '@ericastutz/gosling.js';
//import { debounce } from 'lodash-es';

const MARK_OPTIONS = ['withinLink', 'betweenLink'];

const goslingSpec = (mark, layout, tension) => {
	return {
		title: 'Circos',
		description: 'http://circos.ca/intro/genomic_data/',
		layout: layout,
		static: true,
		spacing: 1,
		centerRadius: 0.5,
		alignment: 'stack',
		style: { linkStyle: 'experimentalEdgeBundling', edgeBundlingTension: tension },
		views: [
			{
				tracks: [
					{
						id: 'outer_track',
						alignment: 'overlay',
						data: {
							url: 'https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/UCSC.HG38.Human.CytoBandIdeogram.csv',
							type: 'csv',
							chromosomeField: 'Chromosome',
							genomicFields: ['chromStart', 'chromEnd']
						},
						tracks: [
							{ mark: 'rect'},
							{
								mark: 'brush',
								x: {linkingId: 'mid-scale'},
								strokeWidth: {value: 1.5},
								stroke: {value: '#0070DC'},
								color: {value: '#AFD8FF'},
								opacity: {value: 0.5}
							}
						],
						color: {
							field: 'Stain',
							type: 'nominal',
							domain: [
								'gneg',
								'gpos25',
								'gpos50',
								'gpos75',
								'gpos100',
								'gvar',
								'acen'
							],
							range: [
								'white',
								'lightgray',
								'gray',
								'gray',
								'black',
								'#7B9CC8',
								'#DC4542'
							]
						},
						size: {value: 18},
						x: {field: 'chromStart', type: 'genomic'},
						xe: {field: 'chromEnd', type: 'genomic'},
						stroke: {value: 'gray'},
						strokeWidth: {value: 0.3},
						width: 500,
						height: 100
					},
					{
						id: 'edgebundle',
						data: {
							url: 'https://s3.amazonaws.com/gosling-lang.org/data/SV/7d332cb1-ba25-47e4-8bf8-d25e14f40d59.pcawg_consensus_1.6.161022.somatic.sv.bedpe',
							type: 'csv',
							genomicFieldsToConvert: [
								{chromosomeField: 'chrom1', genomicFields: ['start1', 'end1']},
								{chromosomeField: 'chrom2', genomicFields: ['start2', 'end2']}
							],
							separator: '\t'
						},
						dataTransform: [
							{
								type: 'svType',
								firstBp: {
									chrField: 'chrom1',
									posField: 'start1',
									strandField: 'strand1'
								},
								secondBp: {
									chrField: 'chrom2',
									posField: 'end1',
									strandField: 'strand2'
								},
								newField: 'sv'
							}, 
							{
								type: 'filter',
								field: 'sv',
								oneOf: ['TRA']
							}
						],
						mark: 'withinLink',
						x: {field: 'start1', type: 'genomic'},
						xe: {field: 'end2', type: 'genomic'},
						stroke: {field: 'sv', type: 'nominal'},
						strokeWidth: {value: 1.5},
						opacity: {value: 0.15},
						width: 700,
						height: 300
					},
					
				]
			},
		]
	}
};

function WidgetEncoding() {
	const gosRef = useRef(null);

	const [mark, setMark] = useState('withinLink');
	const [layout] = useState('circular');
	const [tension, setBinSize] = useState(0);

	return (
		<>
			<span>
				<div style={{ marginTop: 30, marginLeft: 80 }}>
					{'Tension: '}
					<input
						type="range"
						min={0}
						max={0.3}
						step={0.01}
						value={tension}
						className="slider"
						id="bin-slider"
						style={{ width: 100, display: 'inline', margin: 10 }}
						//onChange={debounce((e) => setBinSize(+e.currentTarget.value), 1500)}
						onChange={(e) => setBinSize(+e.currentTarget.value)}
					/>
					{tension === 0 ? 0 : tension}
				</div>
			</span>
			<div style={{ marginTop: 30, marginLeft: 80 }}>
				{'Mark: '}
				<select name="mark" onChange={(e) => setMark(e.currentTarget.value)}>
					{MARK_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
				</select>
			</div>

			<GoslingComponent
				ref={gosRef}
				spec={goslingSpec(mark, layout, tension)}
				experimental={{ reactive: true }}
			/>
		</>
	);
}

export default WidgetEncoding;


