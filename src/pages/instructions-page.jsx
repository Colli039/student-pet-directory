import '../css/instructions-page.css'

function InstructionsPage () {
  return (
    <div className='insructions-body'>
      <h1>Midterm Exam Scenario</h1>
      <div className='snippet'>
        <p>
          You must be able to connect the application to your S3 bucket through your Lambda
          function.
        </p>
        <p>
          The only services you need to configure are included in the criteria
          below.
        </p>
      </div>

      <h1>Criteria:</h1>
      <div className='snippet'>
        <p>Correct EC2 configuration: 20pts</p>
        <p>Correct Lambda configuration: 10pts</p>
        <p>Correct S3 configuration: 15pts</p>
        <p>Pet Management – Capable of CRUD operations: 5pts</p>
        <p className='bold'>Total: 50pts</p>
      </div>

      <h1>Bonus Points!</h1>
      <div className='snippet'>
        <p className="bold">You can receive bonus points if:</p>
        <p>A. Your pet entry is included in the Top 10</p>
        <p>
          B. You use a lambda function to create a thumbnail out of the image
          you've uploaded
        </p>
      </div>

      <h1>Good luck! :)</h1>
    </div>
  )
}

export default InstructionsPage
