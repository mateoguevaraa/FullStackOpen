const Course = ({course}) => {
    const name = course.name
    const parts = course.parts
    const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0)
    return (
    <>
      <Header name={name}/>
      <Content parts={parts} />
      <Total sum={totalExercises} />
    </>
    )
  }
  
  const Header = ({ name }) => <h1>{name}</h1>
  
  const Total = ({ sum }) => <strong>total of {sum} exercises</strong>
  
  const Part = ({ part }) => 
    <p>
      {part.name} {part.exercises}
    </p>
  
  const Content = ({ parts }) => {
      const result = parts.map(part => <Part part={part} key={part.id}/>)
      return result
  }

  export default Course