import { range, randomSample, uniformRandom, randRange, maxBy, assert, chain, iterableMap } from '../utils';
import Topic from '../observable';

export interface ProgressInfo<Solution> {
    bestSolution: Solution;
    generation: number;
    satisfactory: boolean;
}

export default abstract  class GeneticAlgorithm<Solution, Score> {
    public readonly maxGenerations: number;
    protected populationSize: number;
    protected matingPoolSize: number;
    protected eliteSize: number;
    protected asexualReproductionSize: number;
    protected get sexualReproductionSize(): number {
        return this.populationSize - this.eliteSize - this.asexualReproductionSize;
    }
    protected mutationFactor: number;
    protected generationStartTS: number = +new Date;
    public readonly topic: Topic<ProgressInfo<Solution>>;
    private previousBestScore: number = -Infinity;

    protected constructor(
        maxGenerations: number,
        populationSize: number,
        matingPoolSize: number,
        eliteSize: number,
        asexualReproductionSize: number,
        mutationFactor: number
    ) {
        assert(maxGenerations > 0);
        assert(populationSize > 2);
        assert(matingPoolSize < populationSize);
        assert(asexualReproductionSize + eliteSize < matingPoolSize);
        assert(0 < mutationFactor);
        assert(mutationFactor < 1);

        this.maxGenerations = maxGenerations;
        this.populationSize = populationSize;
        this.matingPoolSize = matingPoolSize;
        this.eliteSize = eliteSize;
        this.asexualReproductionSize = asexualReproductionSize;
        this.mutationFactor = mutationFactor;
        this.topic = new Topic();
    }

    protected abstract createInitialSolution(idx: number): Solution;
    protected abstract evaluateFitness(population: Solution[], generation: number): [Solution, Score][];
    protected abstract getGenes(solution: Solution): Float32Array;
    protected abstract constructSolution(genes: Float32Array): Solution;
    protected abstract mutateGene(gene: number): number;
    protected abstract isSatisfactory(generation: number, solution: Solution, score: Score): boolean;

    protected onGenerationStart(generation: number): void {
        console.log(`Generation ${generation + 1}/${this.maxGenerations}`);
        this.generationStartTS = +new Date;
    }

    protected onGenerationEnd(generation: number, bestSolution: Solution, bestScore: Score): boolean {
        const timeDiff = (+new Date) - this.generationStartTS;
        const currentScore = +bestScore;
        const improvement = currentScore - this.previousBestScore;
        // TODO move to the main loop
        const satisfactory = this.isSatisfactory(generation, bestSolution, bestScore);
        this.topic.next({
            bestSolution,
            generation,
            satisfactory
        });
        console.log(`Generation ${generation + 1}/${this.maxGenerations} best score ${currentScore} (improvement ${improvement}) took ${(timeDiff / 1000).toFixed(1)} seconds.`);
        this.previousBestScore = currentScore;
        return false;
    }

    protected selectParents(scoredPopulation: [Solution, Score][]): Solution[] {
        return scoredPopulation.map(
            ([solution, score]: [Solution, Score]) => solution
        ).slice(
            0, this.matingPoolSize
        );
    }

    protected reproduce(matingPool: Solution[]): Solution[] {
        const genePool: Float32Array[] = matingPool.map(this.getGenes.bind(this));

        const elite = genePool.slice(0, this.eliteSize); // umodified elite
        const asexualReproductionOffspring = genePool.slice(
            0, this.asexualReproductionSize
        ).map(
            (genes: Float32Array) => new Float32Array(genes) // copied because muation is applied in-place
        );
        const sexualReproductionOffspring = range(this.sexualReproductionSize).map(_ => this.getCrossover(genePool));

        for (const genes of chain(asexualReproductionOffspring, sexualReproductionOffspring)) {
            this.applyMutation(genes);
        }
        const offspringGenes = chain(elite, asexualReproductionOffspring, sexualReproductionOffspring);
        const offspring = iterableMap(offspringGenes, this.constructSolution.bind(this));
        return offspring;
    }

    protected getCrossover(genePool: Float32Array[]): Float32Array {
        // TODO weighted selection
        const [motherGenes, fatherGenes] = randomSample(genePool.length, 2).map(idx => genePool[idx]);
        const crossOverPoint = randRange(motherGenes.length);
        const childGenes = new Float32Array(motherGenes.length);
        childGenes.set(motherGenes.subarray(0, crossOverPoint), 0);
        childGenes.set(fatherGenes.subarray(crossOverPoint), crossOverPoint);
        return childGenes;
    }

    protected applyMutation(genes: Float32Array): void {
        const numberOfMutations = ~~(genes.length * this.mutationFactor);
        const mutationIndices = randomSample(genes.length, numberOfMutations);
        for (const idx of mutationIndices) {
            genes[idx] = this.mutateGene(genes[idx]);
        }
    }

    protected sortScoredPopulation(scoredPopulation: [Solution, Score][]): void {
        scoredPopulation.sort(
            (
                [aSolution, aScore]: [Solution, Score],
                [bSolution, bScore]: [Solution, Score]
            ) => (+bScore) - (+aScore)
        );
    }

    public evolve(): Solution[] {
        let population: Solution[] = range(this.populationSize).map(idx => this.createInitialSolution(idx));
        for (let generation = 0; generation < this.maxGenerations; generation++) {
            this.onGenerationStart(generation);
            const scoredPopulation: [Solution, Score][] = this.evaluateFitness(population, generation);
            // this.logScoredPopulation(generation, scoredPopulation);
            this.sortScoredPopulation(scoredPopulation);
            const [bestSolution, bestScore]: [Solution, Score] = scoredPopulation[0];
            const shouldTerminateEarly = this.onGenerationEnd(generation, bestSolution, bestScore);
            if (shouldTerminateEarly) {
                break;
            }
            if (generation < this.maxGenerations - 1) {
                const matingPool: Solution[] = this.selectParents(scoredPopulation);
                population = this.reproduce(matingPool);
            }
        }
        return population;
    }

    public evolveBest(): Solution {
        const solutions: Solution[] = this.evolve();
        return solutions[0];
    }

    private logScoredPopulation(generation: number, population: [Solution, Score][]): void {
        for (const [idx, [solution, score]] of population.entries()) {
            console.log(`GEN ${generation + 1} SOL ${idx} SCORE ${+score}`);
        }
    }
}
